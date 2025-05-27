import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/addProduct.css';
import ApiService from "../../service/ApiService";

const AddProductPage = () => {
    const [formData, setFormData] = useState({
        image: null,
        categoryId: '',
        name: '',
        description: '',
        price: '',
        product_code: '',
        type: 'NEW',
        purchasable: false,
        specifications: '{}',
        model: ''
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: '', isError: false });
    const [isLoading, setIsLoading] = useState(false);
    const [specsExample, setSpecsExample] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getAllCategories().then((res) => setCategories(res.categoryList));
    }, []);

    useEffect(() => {
        // Update specs example based on product type
        if (formData.type === 'RECONDITIONED') {
            setSpecsExample('Example: {"condition":"Excellent","warranty":"1 year"}');
        } else if (formData.type === 'PART') {
            setSpecsExample('Example: {"compatibility":["Model X","Model Y"],"material":"Aluminum"}');
        } else {
            setSpecsExample('');
        }
        
        // NEW products cannot be purchasable
        if (formData.type === 'NEW') {
            setFormData(prev => ({ ...prev, purchasable: false }));
        }
    }, [formData.type]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImage = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', isError: false });
        
        try {
            // Validate specifications JSON
            if (formData.type === 'RECONDITIONED' && formData.specifications.trim() === '{}') {
                throw new Error("Reconditioned products require specifications");
            }

            const formDataToSend = new FormData();
            formDataToSend.append('image', formData.image);
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('product_code', formData.product_code);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('purchasable', formData.purchasable);
            formDataToSend.append('specificationsJson', formData.specifications);
            formDataToSend.append('model', formData.model);

            const response = await ApiService.addProduct(formDataToSend);
            
            setMessage({ text: response.message, isError: false });
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || error.message || 'Failed to add product',
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Add Product</h2>
                
                {message.text && (
                    <div className={`message ${message.isError ? 'error' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label>Product Image*</label>
                    <input 
                        type="file" 
                        onChange={handleImage} 
                        required
                    />
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
                            <option value={cat.id} key={cat.id}>{cat.name}</option>
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
                        name="product_code"
                        placeholder="Unique product code"
                        value={formData.product_code}
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
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="NEW">New</option>
                        <option value="RECONDITIONED">Reconditioned</option>
                        <option value="PART">Part</option>
                    </select>
                </div>

                {formData.type !== 'NEW' && (
                    <div className="form-group">
                        <label>Price*</label>
                        <input 
                            type="number"
                            name="price"
                            placeholder="Product price"
                            value={formData.price}
                            onChange={handleChange}
                            required={formData.type !== 'NEW'}
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
                            disabled={formData.type === 'NEW'}
                        />
                        Purchasable
                    </label>
                    {formData.type === 'NEW' && (
                        <span className="hint">(NEW products cannot be purchasable)</span>
                    )}
                </div>

                {(formData.type === 'RECONDITIONED' || formData.type === 'PART') && (
                    <div className="form-group">
                        <label>
                            Specifications {formData.type === 'RECONDITIONED' && '*'}
                            {specsExample && <div className="hint">{specsExample}</div>}
                        </label>
                        <textarea
                            name="specifications"
                            placeholder='Enter specifications as JSON (e.g., {"color":"red","size":"XL"})'
                            value={formData.specifications}
                            onChange={handleChange}
                            required={formData.type === 'RECONDITIONED'}
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;