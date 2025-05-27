import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../style/addProduct.css';
import ApiService from "../../service/ApiService";

const EditProductPage = () => {
    const { productId } = useParams();
    const [formData, setFormData] = useState({
        image: null,
        categoryId: '',
        name: '',
        description: '',
        price: '',
        productCode: '',
        type: 'NEW',
        purchasable: false,
        specifications: '{}',
        model: '',
        imageUrl: null,
        originalType: 'NEW' // To track the original product type
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: '', isError: false });
    const [isLoading, setIsLoading] = useState(false);
    const [specsExample, setSpecsExample] = useState('');
    const navigate = useNavigate();

 useEffect(() => {
    const fetchData = async () => {
        try {
            // Load categories first
            const categoriesResponse = await ApiService.getAllCategories();
            setCategories(categoriesResponse.categoryList);

            // Then load product data
            if (productId) {
                const productResponse = await ApiService.getProductById(productId);
                const product = productResponse.product;
                const specs = product.specifications ? JSON.stringify(product.specifications) : '{}';
                
                console.log('Loaded product data:', product); // Add this for debugging
                
                setFormData({
                    ...formData,
                    categoryId: product.categoryId ? product.categoryId.toString() : '',
                    productCode: product.productCode || '',
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price ? product.price.toString() : '',
                    type: product.type || 'NEW',
                    purchasable: product.purchasable || false,
                    specifications: specs,
                    model: product.model || '',
                    imageUrl: product.imageUrl || null,
                    originalType: product.type || 'NEW'
                });
                
                updateSpecsExample(product.type);
            }
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Failed to load product data', 
                isError: true 
            });
            console.error('Error loading product:', error); // Add error logging
        }
    };

    fetchData();
}, [productId]);

    const updateSpecsExample = (type) => {
        if (type === 'RECONDITIONED') {
            setSpecsExample('Example: {"condition":"Excellent","warranty":"1 year"}');
        } else if (type === 'PART') {
            setSpecsExample('Example: {"compatibility":["Model X","Model Y"],"material":"Aluminum"}');
        } else {
            setSpecsExample('');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Block type changes if trying to modify from original
        if (name === 'type' && value !== formData.originalType) {
            setMessage({ 
                text: `Product type cannot be changed. Current type: ${formData.originalType}`, 
                isError: true 
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImage = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0],
            imageUrl: URL.createObjectURL(e.target.files[0])
        }));
    };

    const validateForm = () => {
        // NEW product validations
        if (formData.originalType === 'NEW') {
            if (formData.price && formData.price !== '') {
                setMessage({ 
                    text: 'NEW products cannot have a price', 
                    isError: true 
                });
                return false;
            }

            if (formData.purchasable) {
                setMessage({ 
                    text: 'NEW products must remain non-purchasable', 
                    isError: true 
                });
                return false;
            }

            try {
                const specs = JSON.parse(formData.specifications);
                if (Object.keys(specs).length === 0) {
                    setMessage({ 
                        text: 'NEW products must have specifications', 
                        isError: true 
                    });
                    return false;
                }
            } catch (e) {
                setMessage({ 
                    text: 'Invalid specifications JSON format', 
                    isError: true 
                });
                return false;
            }
        }
        
        // RECONDITIONED product validations
        if (formData.originalType === 'RECONDITIONED') {
            if (!formData.price || formData.price === '') {
                setMessage({ 
                    text: 'RECONDITIONED products must have a price', 
                    isError: true 
                });
                return false;
            }

            try {
                const specs = JSON.parse(formData.specifications);
                if (Object.keys(specs).length === 0) {
                    setMessage({ 
                        text: 'Reconditioned products require specifications', 
                        isError: true 
                    });
                    return false;
                }
            } catch (e) {
                setMessage({ 
                    text: 'Invalid specifications JSON format', 
                    isError: true 
                });
                return false;
            }
        }

        // PART product validations
        if (formData.originalType === 'PART' && (!formData.price || formData.price === '')) {
            setMessage({ 
                text: 'PART products must have a price', 
                isError: true 
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', isError: false });
    
    if (!validateForm()) {
        setIsLoading(false);
        return;
    }

    try {
        const formDataToSend = new FormData();
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        formDataToSend.append('productId', productId);
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        
        if (formData.originalType !== 'NEW') {
            formDataToSend.append('price', formData.price);
        }
        
        formDataToSend.append('productCode', formData.productCode);
        formDataToSend.append('type', formData.originalType);
        formDataToSend.append('purchasable', formData.purchasable);
        formDataToSend.append('specificationsJson', formData.specifications);
        formDataToSend.append('model', formData.model);

        const response = await ApiService.updateProduct(formDataToSend);
        
        // Handle success case
        setMessage({ 
            text: 'Product updated successfully', 
            isError: false 
        });
        setTimeout(() => navigate('/admin/products'), 2000);
        
    } catch (error) {
        // Check for duplicate product code error specifically
        if (error.response?.data?.message?.includes("Product code already exists") || 
            error.message?.includes("Product code already exists")) {
            setMessage({
                text: 'This product code is already in use. Please use a different code.',
                isError: true
            });
        } 
        // Handle other error cases
        else {
            setMessage({ 
                text: error.response?.data?.message || error.message || 'Failed to update product',
                isError: true
            });
        }
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Edit Product</h2>
                
                {message.text && (
                    <div className={`message ${message.isError ? 'error' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label>Product Image</label>
                    <input 
                        type="file" 
                        onChange={handleImage} 
                    />
                    {formData.imageUrl && (
                        <img src={formData.imageUrl} alt={formData.name} className="preview-image" />
                    )}
                </div>

                    <div className="form-group">
                    <label>Category*</label>
                    <select 
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option value={cat.id.toString()} key={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                 </div>
 
                <div className="form-group">
                    <label>Product Name*</label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description*</label>
                    <textarea 
                        name="description"
                        placeholder="Product description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Code*</label>
                    <input 
                        type="text"
                        name="productCode"
                        placeholder="Unique product code"
                        value={formData.productCode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Model*</label>
                    <input 
                        type="text"
                        name="model"
                        placeholder="Product model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Type*</label>
                    <select 
                        name="type"
                        value={formData.originalType}
                        onChange={handleChange}
                        required
                        disabled
                    >
                        <option value="NEW">New</option>
                        <option value="RECONDITIONED">Reconditioned</option>
                        <option value="PART">Part</option>
                    </select>
                    <div className="hint">(Product type cannot be changed)</div>
                </div>

                {formData.originalType !== 'NEW' && (
                    <div className="form-group">
                        <label>Price*</label>
                        <input 
                            type="number"
                            name="price"
                            placeholder="Product price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>
                )}

                <div className="form-group checkbox-group">
                    <label>
                        <input 
                            type="checkbox"
                            name="purchasable"
                            checked={formData.purchasable}
                            onChange={handleChange}
                            disabled={formData.originalType === 'NEW'}
                        />
                        Purchasable
                    </label>
                    {formData.originalType === 'NEW' && (
                        <span className="hint">(NEW products cannot be purchasable)</span>
                    )}
                </div>

                {(formData.originalType === 'RECONDITIONED' || formData.originalType === 'PART') && (
                    <div className="form-group">
                        <label>
                            Specifications {formData.originalType === 'RECONDITIONED' && '*'}
                            {specsExample && <div className="hint">{specsExample}</div>}
                        </label>
                        <textarea
                            name="specifications"
                            placeholder='Enter specifications as JSON (e.g., {"color":"red","size":"XL"})'
                            value={formData.specifications}
                            onChange={handleChange}
                            required={formData.originalType === 'RECONDITIONED'}
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating Product...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;