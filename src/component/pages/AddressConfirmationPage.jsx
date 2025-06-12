import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";

const AddressConfirmationPage = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash"); // Default to cash on delivery

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await ApiService.getLoggedInUserInfo();
                setUserAddress(response.user.address);
            } catch (error) {
                setMessage(error.response?.data?.message || error.message || "Failed to fetch address");
            }
        };
        fetchAddress();
    }, []);

    const handleEditAddress = () => {
        navigate("/edit-address", { state: { from: 'checkout' } });
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleProceedToCheckout = async () => {
    // Prevent order creation if online payment is selected
    if (paymentMethod === "online") {
        navigate("/payment-gateway"); // Redirect to info page
        return; // Exit the function early
    }

    // Proceed with order creation only for cash on delivery
    const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
    }));

    const orderRequest = {
        totalPrice,
        items: orderItems,
        paymentMethod
    }

    try {
        const response = await ApiService.createOrder(orderRequest);
        setMessage(response.message)
        setTimeout(() => {
            setMessage('')
            navigate("/order-success");
        }, 3000);
    } catch (error) {
        setMessage(error.response?.data?.message || error.message || 'Failed to place an order');
        setTimeout(() => {
            setMessage('')
        }, 3000);
    }
};

    return (
        <div className="address-confirmation-page" style={styles.container}>
            <h1 style={styles.title}>Order Summary</h1>
            {message && <p className="response-message" style={styles.message}>{message}</p>}

            <div style={styles.contentWrapper}>
                <div style={styles.productsSection}>
                    <h2 style={styles.sectionTitle}>Your Products</h2>
                    <ul style={styles.productList}>
                        {cart.map(item => (
                            <li key={item.id} style={styles.productItem}>
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    style={styles.productImage}
                                />
                                <div style={styles.productDetails}>
                                    <h3 style={styles.productName}>{item.name}</h3>
                                    <p style={styles.productInfo}>Quantity: {item.quantity}</p>
                                    <p style={styles.productInfo}>Price: ${item.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3 style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</h3>
                </div>

                <div style={styles.addressSection}>
                    <h2 style={styles.sectionTitle}>Shipping Address</h2>
                    {userAddress ? (
                        <div style={styles.addressDisplay}>
                            <p style={styles.addressText}>{userAddress.street}</p>
                            <p style={styles.addressText}>{userAddress.city}, {userAddress.state} {userAddress.zipCode}</p>
                            <p style={styles.addressText}>{userAddress.country}</p>
                            <button 
                                onClick={handleEditAddress}
                                style={styles.editButton}
                            >
                                Edit Address
                            </button>
                        </div>
                    ) : (
                        <p>No address found. Please add one.</p>
                    )}
                </div>

                {/* New Payment Method Section */}
                <div style={styles.paymentSection}>
                    <h2 style={styles.sectionTitle}>Payment Method</h2>
                    <div style={styles.paymentOptions}>
                        <label style={styles.paymentOption}>
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === "cash"}
                                onChange={() => handlePaymentMethodChange("cash")}
                                style={styles.radioInput}
                            />
                            <div style={styles.paymentOptionContent}>
                                <span style={styles.paymentOptionTitle}>Cash on Delivery</span>
                                <span style={styles.paymentOptionDescription}>Pay with cash when your order is delivered</span>
                            </div>
                        </label>
                        
                        <label style={styles.paymentOption}>
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === "online"}
                                onChange={() => handlePaymentMethodChange("online")}
                                style={styles.radioInput}
                            />
                            <div style={styles.paymentOptionContent}>
                                <span style={styles.paymentOptionTitle}>Online Payment</span>
                                <span style={styles.paymentOptionDescription}>Pay securely with your credit/debit card</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <button 
                className="checkout-button" 
                onClick={handleProceedToCheckout}
                disabled={!userAddress}
                style={styles.checkoutButton}
            >
                {paymentMethod === "online" ? "Proceed to Payment" : "Complete Order"}
            </button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
    message: {
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        marginBottom: '30px',
    },
    productsSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: '22px',
        marginBottom: '15px',
        color: '#444',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    productList: {
        listStyle: 'none',
        padding: 0,
    },
    productItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
    },
    productImage: {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
        marginRight: '20px',
        borderRadius: '4px',
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: '18px',
        margin: '0 0 5px 0',
        color: '#333',
    },
    productInfo: {
        fontSize: '16px',
        margin: '5px 0',
        color: '#666',
    },
    totalPrice: {
        fontSize: '20px',
        textAlign: 'right',
        marginTop: '15px',
        color: '#333',
    },
    addressSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    addressDisplay: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '15px',
    },
    addressText: {
        fontSize: '16px',
        margin: '5px 0',
        lineHeight: '1.5',
    },
    editButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px',
    },
    paymentSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    paymentOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    paymentOption: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#f8f9fa',
    },
    paymentOptionContent: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '15px',
    },
    paymentOptionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px',
    },
    paymentOptionDescription: {
        fontSize: '14px',
        color: '#666',
    },
    radioInput: {
        marginTop: '3px',
        cursor: 'pointer',
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        display: 'block',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto',
    },
};

export default AddressConfirmationPage;