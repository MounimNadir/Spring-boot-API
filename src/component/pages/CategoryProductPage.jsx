import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import '../../style/home.css';

const CategoryProductsPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Changed to 0 to match API pagination
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");
    const itemsPerPage = 8;

    useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      const categoryResponse = await ApiService.getCategoryById(categoryId);
      if (isMounted) setCategoryName(categoryResponse.category?.name || "");
      
      // Fetch products
      const productsResponse = await ApiService.getProductsByCategory(
        categoryId, 
        currentPage, 
        itemsPerPage
      );
      
      if (isMounted) {
        setProducts(productsResponse.productList || []); // Changed from 'content' to 'productList'
        setTotalPages(productsResponse.totalPage || 1); // Changed from 'totalPages' to 'totalPage'
      }
    } catch (error) {
      if (isMounted) {
        setError(error.response?.data?.message || 'No products found');
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();
  
  return () => { isMounted = false };
}, [categoryId, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="home">
            <h2 className="category-title">
                {categoryName ? `Products in ${categoryName}` : "Category Products"}
            </h2>

            {loading ? (
                <p className="loading-placeholder">Loading products...</p> // Simple loading text instead
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : products.length === 0 ? (
                <p className="empty-message">No products found in this category</p>
            ) : (
                <>
                    <ProductList products={products} />
                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryProductsPage;
