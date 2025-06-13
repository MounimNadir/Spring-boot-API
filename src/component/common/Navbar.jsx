import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/navbar.css';

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout? ");
        if(confirm){
            ApiService.logout();
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/"><img src="./logo_here.png" alt="Company Logo" /></NavLink>
            </div>
            
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    placeholder="Search products" 
                    value={searchValue}
                    onChange={handleSearchChange} 
                />
                <button type="submit">Search</button>
            </form>

            <div className="navbar-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About us</NavLink>
                <NavLink to="/categories">Categories</NavLink>
                
                {isAdmin && <NavLink to="/admin">Admin</NavLink>}
                
                {isAuthenticated && (
                    <div className="account-dropdown-container" ref={dropdownRef}>
                        <button 
                            className="account-dropdown-toggle"
                            onClick={toggleDropdown}
                            aria-expanded={dropdownOpen}
                        >
                            My Account
                            <span className="dropdown-chevron"></span>
                        </button>
                        
                        {dropdownOpen && (
                            <div className="account-dropdown">
                                <NavLink 
                                    to="/account/personal" 
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Personal Information
                                </NavLink>
                                <NavLink 
                                    to="/account/orders" 
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Order History
                                </NavLink>
                                <button 
                                    className="dropdown-logout-button"
                                    onClick={() => {
                                        handleLogout();
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                <NavLink to="/cart">
                    Cart <img src="./shopping-cart.png" alt="Cart" className="shopping-cart" />
                </NavLink>
                
                {!isAuthenticated && <NavLink to="/login">Login</NavLink>}
            </div>
        </nav>
    );
};

export default Navbar;