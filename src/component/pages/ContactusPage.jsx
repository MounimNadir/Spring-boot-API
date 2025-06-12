import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/contact.css';
import ApiService from "../../service/ApiService";

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
        await ApiService.sendContactForm(formData);
        
        setSubmitMessage('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        
        setTimeout(() => {
            setSubmitMessage('');
            navigate('/');
        }, 3000);
    } catch (error) {
        setSubmitMessage(error.response?.data || 
                         'Failed to send message. Please try again later.');
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1>Contact Us</h1>
                <p className="contact-intro">
                    Have questions or feedback? We'd love to hear from you! 
                    Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`}>
                        {submitMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error-input' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error-input' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={errors.subject ? 'error-input' : ''}
                        />
                        {errors.subject && <span className="error-text">{errors.subject}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            className={errors.message ? 'error-input' : ''}
                        />
                        {errors.message && <span className="error-text">{errors.message}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <div className="contact-info">
                    <h2>Other Ways to Reach Us</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <p>support@yourstore.com</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-phone"></i>
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>Address</h3>
                            <p>123 Store Street, Cityville, ST 12345</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;