import React from "react";
import { useNavigate } from "react-router-dom";

const OnlinePayment = () => {
    const navigate = useNavigate();

    const handleChangePaymentMethod = () => {
        navigate("/confirm-address"); // Assuming this is your address confirmation page route
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Online Payment</h1>
                <div style={styles.messageBox}>
                    <p style={styles.message}>
                        We're currently working on our online payment system to make it more secure and convenient for you.
                    </p>
                    <p style={styles.message}>
                        For now, we only accept <strong>Cash on Delivery</strong>.
                    </p>
                    <p style={styles.message}>
                        We appreciate your understanding and look forward to serving you!
                    </p>
                </div>
                <button 
                    onClick={handleChangePaymentMethod}
                    style={styles.button}
                >
                    Change Payment Method
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
    },
    content: {
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        color: "#333",
        marginBottom: "20px",
    },
    messageBox: {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
    },
    message: {
        fontSize: "16px",
        color: "#555",
        lineHeight: "1.6",
        margin: "10px 0",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 25px",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s",
    },
};

export default OnlinePayment;