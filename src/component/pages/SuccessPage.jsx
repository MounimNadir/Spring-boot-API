import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SuccessPage = () => {
    const navigate = useNavigate();
    const { dispatch } = useCart();

    // Clear cart when success page loads
     React.useEffect(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, [dispatch]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconContainer}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="80" 
                        height="80" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#4BB543" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h1 style={styles.title}>Order Placed Successfully!</h1>
                
                <p style={styles.message}>
                    Thank you for your purchase! Your order has been confirmed and will be processed shortly.
                    A confirmation email has been sent to your registered email address.
                </p>
                
                <div style={styles.buttonGroup}>
                    <button 
                        onClick={() => navigate("/")} 
                        style={styles.continueButton}
                    >
                        Continue Shopping
                    </button>
                    
                    <button 
                        onClick={() => navigate("/profile")} 
                        style={styles.ordersButton}
                    >
                        View Your Orders
                    </button>
                </div>
                
                <p style={styles.helpText}>
                    Need help? <a href="/contact" style={styles.helpLink}>Contact us</a>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
        padding: "40px",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center"
    },
    iconContainer: {
        marginBottom: "20px"
    },
    title: {
        fontSize: "28px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "15px"
    },
    message: {
        fontSize: "16px",
        color: "#555",
        lineHeight: "1.6",
        marginBottom: "30px"
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginBottom: "25px"
    },
    continueButton: {
        backgroundColor: "#4BB543",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.3s",
        width: "100%"
    },
    ordersButton: {
        backgroundColor: "transparent",
        color: "#4BB543",
        border: "2px solid #4BB543",
        padding: "12px 20px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s",
        width: "100%"
    },
    helpText: {
        fontSize: "14px",
        color: "#777"
    },
    helpLink: {
        color: "#4BB543",
        textDecoration: "none",
        fontWeight: "600"
    }
};

export default SuccessPage;