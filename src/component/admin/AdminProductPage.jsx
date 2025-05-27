import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminProduct.css';
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const itemsPerPage = 10;
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

   const fetchProducts = async () => {
    setIsLoading(true);
    try {
        const sortParam = `${sortField},${sortDirection}`;
        console.log('Sending sort parameter:', sortParam); // Debug log
        
        const response = await ApiService.getAllProducts({
            sort: sortParam,
            page: currentPage - 1,
            size: itemsPerPage
        });
        setProducts(response.productList || []);
        setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
        setError(null);
    } catch (error) {
        console.error('Error fetching products:', error); // Debug log
        setError(error.response?.data?.message || "Failed to load products");
    } finally {
        setIsLoading(false);
    }
};

     const handleSortDirectionChange = (e) => {
        setSortDirection(e.target.value);
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, sortField, sortDirection]);

    const handleDeleteClick = (product) => {
        setProductToDelete({
            id: product.id,
            name: product.name,
            orderCount: product.orderCount || 0
        });
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            await ApiService.deleteProduct(productToDelete.id);
            setSuccessMessage(`${productToDelete.name} deleted successfully`);
            
            // Refresh product list
            if (products.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchProducts();
            }
        } catch (error) {
            setError(error.response?.data?.details || 
                   "Failed to delete product. Please try again later.");
        } finally {
            setIsLoading(false);
            setDeleteModalOpen(false);
        }
    };

    const DeleteConfirmationModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Delete Product</h3>
                <p>
                    {productToDelete?.orderCount > 0
                        ? "This product has existing orders and cannot be deleted. Please archive it instead."
                        : `Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`
                    }
                </p>
                <div className="modal-actions">
                    <button 
                        onClick={() => setDeleteModalOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    {productToDelete?.orderCount === 0 && (
                        <button 
                            className="delete-btn"
                            onClick={confirmDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Confirm Delete"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

     const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`)
    }

    return (
        <div className="admin-product-list">
            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                    <button onClick={() => setSuccessMessage(null)}>×</button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && <DeleteConfirmationModal />}

            <div className="product-header">
                <h2>Products</h2>
                <div className="sort-controls">
                    <div className="sort-field">
                        <label>Sort by: </label>
                        <select
                            value={sortField}
                            onChange={(e) => {
                                console.log('Sort field changed to:', e.target.value); // Debug log
                                setSortField(e.target.value);
                            }}
                            disabled={isLoading}
                        >
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="createdAt">need to be fixed date 
                            </option>
                        </select>
                        </div>          
                        <div className="sort-direction">
                        <select
                            value={sortDirection}
                            onChange={(e) => {
                                console.log('Sort direction changed to:', e.target.value); // Debug log
                                setSortDirection(e.target.value);
                            }}
                            disabled={isLoading}
                        >
                            <option value="asc">Ascending (A-Z/0-9)</option>
                            <option value="desc">Descending (Z-A/9-0)</option>
                        </select>
                    </div>
                </div>
                <button 
                    className="add-btn"
                    onClick={() => navigate('/admin/add-product')}
                    disabled={isLoading}
                >
                    + Add Product
                </button>
            </div>

            {isLoading ? (
                <div className="loading">Loading products...</div>
            ) : (
                <>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Orders</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price?.toFixed(2)}</td>
                                    <td>{product.orderCount || 0}</td>
                                    <td className="actions">
                                        <button 
                                            onClick={() => handleEdit(product.id)}
                                            disabled={isLoading}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(product)}
                                            className={product.orderCount > 0 ? "disabled-btn" : ""}
                                            disabled={isLoading || product.orderCount > 0}
                                            title={product.orderCount > 0 ? "Cannot delete - has existing orders" : ""}
                                        >
                                            {product.orderCount > 0 ? (
                                                <span className="lock-icon">🔒 Delete</span>
                                            ) : (
                                                "Delete"
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        disabled={isLoading}
                    />
                </>
            )}
        </div>
    );
};

export default AdminProductPage;