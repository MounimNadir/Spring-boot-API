import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import '../../style/orderdetailsPage.css';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showRequestConfirm, setShowRequestConfirm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

 

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getOrderItemById(orderId);
                setOrder(response.orderItemList?.[0] || response);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load order");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleCancel = async (isRequest) => {
        try {
            setActionLoading(true);
            await ApiService.cancelOrder(orderId, isRequest);
            // Refresh order details
            const response = await ApiService.getOrderItemById(orderId);
            setOrder(response.orderItemList?.[0] || response);
            setShowCancelConfirm(false);
            setShowRequestConfirm(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to process cancellation");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading order details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!order) return <div className="error">Order not found</div>;

    const status = order.status || 'PENDING';
    const canCancel = ['PENDING', 'CONFIRMED', 'SHIPPED'].includes(status);
    const needsRequest = ['CONFIRMED', 'SHIPPED'].includes(status);

    return (
        <div className="order-details">
            <h2>Order Details</h2>
            
            <div className="order-info">
                <div className="info-row">
                    <span>Order ID:</span>
                    <span>{order.id}</span>
                </div>
                <div className="info-row">
                    <span>Date:</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-row">
                    <span>Status:</span>
                    <span className={`status-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
                <div className="info-row">
                    <span>Product:</span>
                    <span>{order.product?.name}</span>
                </div>
                {order.product?.imageUrl && (
                    <div className="info-row">
                        <span>Image:</span>
                        <img 
                            src={order.product.imageUrl} 
                            alt={order.product.name} 
                            className="order-product-image"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                    </div>
                )}
                <div className="info-row">
                    <span>Quantity:</span>
                    <span>{order.quantity}</span>
                </div>
                <div className="info-row">
                    <span>Price per unit:</span>
                    <span>${order.price?.toFixed(2)}</span>
                </div>
                <div className="info-row">
                    <span>Total:</span>
                    <span>${(order.price * order.quantity)?.toFixed(2)}</span>
                </div>
            </div>

            {canCancel && (
                <div className="action-buttons">
                    {needsRequest ? (
                        <>
                            <button 
                                onClick={() => setShowRequestConfirm(true)}
                                className="action-button request"
                            >
                                Request Cancellation
                            </button>
                            {showRequestConfirm && (
                                <div className="confirmation-dialog">
                                    <p>Are you sure you want to request cancellation for this order?</p>
                                    <div className="dialog-buttons">
                                        <button 
                                            onClick={() => handleCancel(true)}
                                            disabled={actionLoading}
                                            className="action-button request"
                                        >
                                            {actionLoading ? 'Processing...' : 'Confirm Request'}
                                        </button>
                                        <button 
                                            onClick={() => setShowRequestConfirm(false)}
                                            className="action-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setShowCancelConfirm(true)}
                                className="action-button cancel"
                            >
                                Cancel Order
                            </button>
                            {showCancelConfirm && (
                                <div className="confirmation-dialog">
                                    <p>Are you sure you want to cancel this order?</p>
                                    <div className="dialog-buttons">
                                        <button 
                                            onClick={() => handleCancel(false)}
                                            disabled={actionLoading}
                                            className="action-button cancel"
                                        >
                                            {actionLoading ? 'Processing...' : 'Confirm Cancellation'}
                                        </button>
                                        <button 
                                            onClick={() => setShowCancelConfirm(false)}
                                            className="action-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            <button 
                onClick={() => navigate('/account/orders')}
                className="action-button back-button"
            >
                Back to Orders
            </button>
        </div>
    );
};

export default OrderDetailsPage;