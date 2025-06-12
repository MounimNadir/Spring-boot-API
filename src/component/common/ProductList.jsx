import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../../style/productList.css';

const EditablePriceInput = ({ value, min, max, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    let val = Number(tempValue);
    if (isNaN(val) || val < min) val = min;
    else if (val > max) val = max;
    onChange(val);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  return editing ? (
    <input
      type="number"
      min={min}
      max={max}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      style={{ width: "70px", fontWeight: "bold", textAlign: "center" }}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{
        cursor: "pointer",
        fontWeight: "bold",
        userSelect: "none",
        display: "inline-block",
        width: "70px",
        textAlign: "center",
        borderBottom: "1px dashed #333"
      }}
      title="Click to edit"
    >
      ${value}
    </span>
  );
};

const ProductList = ({ products, showAddToCart = true, showFilters = true }) => {
    const { cart, dispatch } = useCart();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(80000);

    const addToCart = (product) => {
        if (!product.purchasable) return;
        dispatch({ type: 'ADD_ITEM', payload: product });
    };

    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    };

    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    };

    const filteredProducts = products.filter(product => {
        if (!showFilters) return true; // Skip filtering if filters are hidden
        
        const price = Number(product.price);
        if (isNaN(price)) return true; // Include products without prices
        
        return price >= minPrice && price <= maxPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!a.price && !b.price) return 0;
        if (!a.price) return 1;
        if (!b.price) return -1;
        return a.price - b.price;
    });

    const handleMinPriceChange = (val) => {
        if (val <= maxPrice && val >= 0) setMinPrice(val);
        else setMinPrice(maxPrice);
    };

    const handleMaxPriceChange = (val) => {
        if (val >= minPrice && val <= 80000) setMaxPrice(val);
        else setMaxPrice(minPrice);
    };

    return (
        <div className="product-list-container">
            {showFilters && (
                <aside className="sidebar">
                    <h3>Filter by Price</h3>
                    <div className="price-filter">
                        <label>
                            Min Price:{" "}
                            <EditablePriceInput
                                value={minPrice}
                                min={0}
                                max={maxPrice}
                                onChange={handleMinPriceChange}
                            />
                            <input
                                type="range"
                                min="0"
                                max="80000"
                                value={minPrice}
                                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                            />
                        </label>

                        <label>
                            Max Price:{" "}
                            <EditablePriceInput
                                value={maxPrice}
                                min={minPrice}
                                max={80000}
                                onChange={handleMaxPriceChange}
                            />
                            <input
                                type="range"
                                min="0"
                                max="80000"
                                value={maxPrice}
                                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                            />
                        </label>
                    </div>
                </aside>
            )}

            <main className={`products-main ${!showFilters ? 'full-width' : ''}`}>
                <div className="product-list">
                    {sortedProducts.map((product, index) => {
                        const cartItem = cart.find(item => item.id === product.id);
                        const isPurchasable = product.purchasable && showAddToCart;

                        return (
                            <div className="product-item" key={index}>
                                <div className={`product-badge ${product.type.toLowerCase()}`}>
                                    {product.type}
                                </div>

                                <Link to={`/product/${product.id}`}>
                                    <img 
                                        src={product.imageUrl || '/placeholder-image.jpg'} 
                                        alt={product.name} 
                                        className="product-image" 
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description || 'No description available'}</p>
                                    <span>
                                        {product.price ? `${Number(product.price).toFixed(2)} MAD` : "Price on request"}
                                    </span>
                                </Link>

                                {cartItem ? (
                                    <div className="quantity-controls">
                                        <button onClick={() => decrementItem(product)}>-</button>
                                        <span>{cartItem.quantity}</span>
                                        <button onClick={() => incrementItem(product)}>+</button>
                                    </div>
                                ) : (
                                    isPurchasable ? (
                                        <button onClick={() => addToCart(product)}>Add To Cart</button>
                                    ) : (
                                        <a href="/contact" className="contact-btn">
                                            Contact Us
                                        </a>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default ProductList;