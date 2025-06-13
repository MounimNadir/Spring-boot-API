import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import Navbar from './component/common/Navbar';
import Footer from './component/common/footer';
import { CartProvider } from './component/context/CartContext'; 
import Home from './component/pages/Home';
import ProductDetailsPage from './component/pages/ProductDetailsPage';
import CategoryListPage from './component/pages/CateoryListPage';
import CategoryProductsPage from './component/pages/CategoryProductPage';
import CartPage from './component/pages/CartPage';
import RegisterPage from './component/pages/RegisterPage';
import LoginPage from './component/pages/LoginPage';
import ProfilePage from './component/pages/ProfilePage';
import AddressPage from './component/pages/AddressPage';
import AdminPage from './component/admin/AdminPage';
import AdminCategoryPage from './component/admin/AdminCategoryPage';
import AddCategory from './component/admin/AddCategory';
import EditCategory from './component/admin/EditCategory';
import AdminProductPage from './component/admin/AdminProductPage';
import AddProductPage from './component/admin/AddProduct';
import EditProductPage from './component/admin/EditProductPage';
import AdminOrdersPage from './component/admin/AdminOrderPage';
import AdminOrderDetailsPage from './component/admin/AdminOrderDetailsPage';
import GuestNavbar from './component/common/GuestNavbar';
import { useEffect, useState } from 'react';
import ChoicePage from './component/common/ChoicePage';
import NewEquipment from './component/pages/NewEquipmentPage';
import NewEquipmentPage from './component/pages/NewEquipmentPage';
import AddressConfirmationPage from './component/pages/AddressConfirmationPage';
import ContactUsPage from './component/pages/ContactusPage';
import SuccessPage from './component/pages/SuccessPage';
import OnlinePayment from './component/pages/OnlinePayment';
import UserManagement from './component/admin/UserManagement';
import AboutPage from './component/pages/AboutPage';
import PersonalInfoPage from './component/pages/PersonalInfoPage';
import OrderHistoryPage from './component/pages/OrderHistoryPage';
import OrderDetailsPage from './component/pages/OrderDetailsPage';


function App() {

  const location = useLocation();
  const [userMode, setUserMode] = useState(sessionStorage.getItem('userMode') || '' );

  useEffect(() => {
    const mode = sessionStorage.getItem('userMode');
    setUserMode(mode);
  }, [location]);

   if (!userMode && location.pathname !== '/choice') {
    return <Navigate to="/choice" replace />;
  }



  return (
   
    <CartProvider>
      {userMode === 'newEquipment' && <GuestNavbar />}
      {userMode === 'reconditionedEquipment' && <Navbar />}
      <Routes>
        {/*OUR Routes*/}

        <Route path="/choice" element={<ChoicePage setUserMode={setUserMode} />} />
        <Route path="/guest" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path ="/contact" element={<ContactUsPage />}/>
        <Route path='/newEquipment' element={<NewEquipmentPage />} />
        <Route path='/product/:productId' element = {<ProductDetailsPage/>} />
        <Route path='/categories' element={<CategoryListPage/>} />
        <Route path='/category/:categoryId' element = {<CategoryProductsPage/>} />
        <Route path='/cart'element={<CartPage/>} />
        <Route path='/register' element={<RegisterPage/>} />  
        <Route path='/login' element={<LoginPage/>} />


        <Route path="/account/orders/:orderId/cancel" element= {<ProtectedRoute element={<OrderDetailsPage/>} />} />
        <Route path="/account/orders/:orderId/request-cancel" element= {<ProtectedRoute element={<OrderDetailsPage/>} />} />


        <Route path='/account/personal' element={<ProtectedRoute element={<PersonalInfoPage/>}/>} />
        <Route path='/account/orders' element={<ProtectedRoute element={<OrderHistoryPage/>}/>} />

      <Route 
    path="/account/orders/:orderId" 
    element={<ProtectedRoute element={<OrderDetailsPage />} />} 
/>

        <Route path='/profile' element = {<ProtectedRoute element={<ProfilePage/>}/>} />
        <Route path='/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
        <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />

        <Route path="/confirm-address" element={<ProtectedRoute element={<AddressConfirmationPage />}/>} />

        <Route path='/admin' element={<AdminRoute element={<AdminPage/>} />} />
        <Route path='/admin/categories' element = {<AdminRoute element={<AdminCategoryPage/>} />} />

        <Route path='/admin/add-category' element = {<AdminRoute element={<AddCategory/>} /> } />
        <Route path='/admin/edit-category/:categoryId' element={<AdminRoute element={<EditCategory/>} />} />

        <Route path='/admin/Products' element={<AdminRoute element={<AdminProductPage/>} /> } />
        <Route path='/admin/add-product' element={<AdminRoute element={<AddProductPage/>} />} />
        <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<EditProductPage/>} />} />

        <Route path='/admin/orders' element={<AdminRoute element={<AdminOrdersPage/>} />} />
        <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetailsPage/>} />} />
        <Route path = "/order-success" element={<SuccessPage/>} />
        <Route path= "payment-gateway" element={<OnlinePayment/>} />
        <Route path='/admin/users' element={<UserManagement/>} />
        <Route path='/about' element={<AboutPage/>} />
      </Routes>
      <Footer/>
    </CartProvider>

  );
}

export default App;
