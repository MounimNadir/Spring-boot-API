import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/orderhistorypage.css';
import Pagination from "../common/Pagination";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderHistory();
    }, [currentPage]);

    const fetchOrderHistory = async () => {
        try {
            setIsLoading(true);
            const response = await ApiService.getOrderHistory(currentPage, itemsPerPage);
            setOrders(response.orderItemList || []);
            setTotalElements(response.totalElement || 0);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch order history');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="loading">Loading order history...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="order-history-container">
            <h2 className="order-history-title">My Orders</h2>
            
            {error && <p className="error-message">{error}</p>}

            {orders.length === 0 ? (
                <p className="no-orders">You haven't placed any orders yet</p>
            ) : (
                <>
                    <ul className="order-list">
                        {orders.map(order => {
                            const status = order.status || 'PENDING';
                            return (
                                <li key={order.id} className="order-item">
                                    <div className="order-content">
                                        <div 
                                            className="order-info"
                                            onClick={() => navigate(`/account/orders/${order.id}`)}
                                        >
                                            <div className="order-header">
                                                <span className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className={`status-${status.toLowerCase()}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="product-details">
                                                <span className="product-name">{order.product?.name}</span>
                                                <div className="product-meta">
                                                    <span className="product-quantity">× {order.quantity}</span>
                                                    <span className="product-price">${order.price?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {order.product?.imageUrl && (
                                            <div className="order-image-container">
                                                <img 
                                                    src={order.product.imageUrl} 
                                                    alt={order.product.name} 
                                                    className="order-product-image"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {['PENDING', 'CONFIRMED', 'SHIPPED'].includes(status) && (
                                        <div className="order-actions">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        status === 'PENDING' 
                                                            ? `/account/orders/${order.id}/cancel`
                                                            : `/account/orders/${order.id}/request-cancel`
                                                    );
                                                }}
                                                className={`action-button ${status === 'PENDING' ? 'cancel' : 'request'}`}
                                            >
                                                {status === 'PENDING' ? 'Cancel Order' : 'Request Cancellation'}
                                            </button>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    {totalElements > itemsPerPage && (
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={Math.ceil(totalElements / itemsPerPage)}
                            onPageChange={(page) => setCurrentPage(page - 1)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default OrderHistoryPage;