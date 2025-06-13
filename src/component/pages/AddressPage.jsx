import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/address.css';

const AddressPage = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/edit-address' || location.pathname === '/add-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);

    const fetchUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await ApiService.getLoggedInUserInfo();
            if (response.user.address) {
                setAddress(response.user.address);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to fetch user information");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await ApiService.saveAddress(address);
            
            // Determine redirect based on where user came from
            if (location.state?.from === 'profile') {
                navigate("/account/personal");
            } else {
                // Default redirect for checkout flow and direct access
                navigate("/confirm-address");
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to save address");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="address-page">
            <h2>
                {location.pathname === '/edit-address' ? 'Edit Address' : 'Add Address'}
                {location.state?.from === 'profile' && ' (Profile)'}
                {location.state?.from === 'checkout' && ' (Checkout)'}
            </h2>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>
                    Street:
                    <input 
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <label>
                    City:
                    <input 
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <label>
                    State:
                    <input 
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Zip Code:
                    <input 
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Country:
                    <input 
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Address'}
                </button>
                
                {location.state?.from === 'profile' && (
                    <button 
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/profile")}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddressPage;