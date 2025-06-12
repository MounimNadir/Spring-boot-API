import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/productDetailsPage.css';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { cart, dispatch } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getProductById(productId);
            if (response.product) {
                setProduct(response.product);
            } else {
                setError("Product not found");
            }
        } catch (error) {
            setError(error.message || "Failed to load product");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const addToCart = () => {
        if (product && product.price) {
            dispatch({ type: 'ADD_ITEM', payload: product });
        }
    }

    const incrementItem = () => {
        if (product) {
            dispatch({ type: 'INCREMENT_ITEM', payload: product });
        }
    }

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({ type: 'DECREMENT_ITEM', payload: product });
            } else {
                dispatch({ type: 'REMOVE_ITEM', payload: product });
            }
        }
    }

    if (loading) {
        return <p>Loading product details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Product not available</p>;
    }

    const cartItem = cart.find(item => item.id === product.id);
    const hasPrice = product.price !== undefined && product.price !== null;

    return (
        <div className="product-detail">
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
            </div>
            
            <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-model">Model: {product.model}</p>
                <p className="product-code">Product Code: {product.productCode}</p>
                <p className="product-type">Type: {product.type}</p>
                
                <div className="price-section">
                    {hasPrice ? (
                        <span className="product-price">${product.price.toFixed(2)}</span>
                    ) : (
                        <Link to="/contact" className="contact-link">Contact Us</Link>
                    )}
                </div>

                <div className="product-description">
                    <h3>Description</h3>
                    <p>{product.description}</p>
                </div>

                {product.specifications && (
                    <div className="product-specifications">
                        <h3>Specifications</h3>
                        <table className="specs-table">
                            <tbody>
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="spec-name">{key}</td>
                                        <td className="spec-value">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {hasPrice && (product.purchasable !== false) && (
                    cartItem ? (
                        <div className="quantity-controls">
                            <button onClick={decrementItem}>-</button>
                            <span>{cartItem.quantity}</span>
                            <button onClick={incrementItem}>+</button>
                        </div>
                    ) : (
                        <button onClick={addToCart} className="add-to-cart-btn">
                            Add To Cart
                        </button>
                    )
                )}
            </div>
        </div>
    )
}

export default ProductDetailsPage;