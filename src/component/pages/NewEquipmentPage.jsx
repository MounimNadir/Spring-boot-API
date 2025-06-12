import { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import ProductList from '../common/ProductList';

function NewEquipmentPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getDisplayOnlyProducts();
        if (response && response.productList) {
          setProducts(response.productList);
        } else {
          setError('Unexpected response structure');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="container">Loading products...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>Our Showroom</h2>
      <p>Contact us for purchasing these products</p>
      <ProductList 
        products={products} 
        showAddToCart={false} 
        showFilters={false}
      />
    </div>
  );
}

export default NewEquipmentPage;