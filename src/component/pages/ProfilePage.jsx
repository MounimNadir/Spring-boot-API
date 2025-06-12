import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/profile.css';
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;
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
    }

    const handleAddressClick = () => {
        navigate(
            userInfo.address ? '/edit-address' : '/add-address',
            { state: { from: 'profile' } }  // Added navigation state
        );
    }

    if (isLoading) {
        return <div className="loading">Loading user information...</div>;
    }

    if (!userInfo) {
        return <div className="error-message">{error || 'No user data available'}</div>;
    }

    const orderItemList = userInfo.orderItemList || [];
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="profile-page">
            <h2>Welcome {userInfo.name}</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="info-grid">
                    <div><strong>Name:</strong> {userInfo.name}</div>
                    <div><strong>Email:</strong> {userInfo.email}</div>
                    <div><strong>Phone:</strong> {userInfo.phoneNumber || 'Not provided'}</div>
                </div>
            </div>

            <div className="profile-section">
                <h3>Address Information</h3>
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

            <div className="profile-section">
                <h3>Order History</h3>
                {orderItemList.length === 0 ? (
                    <p className="no-orders">You haven't placed any orders yet</p>
                ) : (
                    <>
                        <ul className="order-list">
                            {paginatedOrders.map(order => (
                                <li key={order.id} className="order-item">
                                    <img 
                                        src={order.product?.imageUrl} 
                                        alt={order.product?.name} 
                                        className="order-image"
                                    />
                                    <div className="order-details">
                                        <p><strong>Name:</strong> {order.product?.name}</p>
                                        <p><strong>Status:</strong> 
                                            <span className={`status-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </p>
                                        <p><strong>Quantity:</strong> {order.quantity}</p>
                                        <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;