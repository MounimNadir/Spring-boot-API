import { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import ProductList from '../common/ProductList';

function NewEquipmentPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ApiService.getDisplayOnlyProducts()
      .then(res => setProducts(res.productList))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Our Showroom</h2>
      <p>Contact us for purchasing these products</p>
      <ProductList products={products} showAddToCart={false} />
    </div>
  );
}

export default NewEquipmentPage;