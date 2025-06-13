import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/profile.css';

const PersonalInfoPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressClick = () => {
        navigate(
            userInfo.address ? '/edit-address' : '/add-address',
            { state: { from: 'profile' } }
        );
    };

    if (isLoading) return <div className="loading">Loading user information...</div>;
    if (!userInfo) return <div className="error-message">{error || 'No user data available'}</div>;

    return (
        <div className="profile-page">
            <h2>My Account</h2>
            <p className="page-subtitle">Personal Information</p>

            {error && <p className="error-message">{error}</p>}

            <div className="profile-section">
                <h3>Personal Details</h3>
                <div className="info-grid">
                    <div><strong>Name:</strong> {userInfo.name}</div>
                    <div><strong>Email:</strong> {userInfo.email}</div>
                    <div><strong>Phone:</strong> {userInfo.phoneNumber || 'Not provided'}</div>
                </div>
            </div>

            <div className="profile-section">
                <h3>Address</h3>
                {userInfo.address ? (
                    <div className="address-grid">
                        <div><strong>Street:</strong> {userInfo.address.street}</div>
                        <div><strong>City:</strong> {userInfo.address.city}</div>
                        <div><strong>State:</strong> {userInfo.address.state}</div>
                        <div><strong>Zip Code:</strong> {userInfo.address.zipCode}</div>
                        <div><strong>Country:</strong> {userInfo.address.country}</div>
                    </div>
                ) : (
                    <p className="no-address">No address information available</p>
                )}
                <button 
                    className="profile-button address-button"
                    onClick={handleAddressClick}
                >
                    {userInfo.address ? "Edit Address" : "Add Address"}
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoPage;