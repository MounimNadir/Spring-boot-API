import React from "react";
import '../../style/footer.css';
import { NavLink } from "react-router-dom";

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer-links">
                <ul>
                    <NavLink to={"/about"}>About Us</NavLink>
                    <NavLink to={"/contact"}>Contact Us</NavLink>
                    <NavLink to={"/"}>Terms & Cnnditions</NavLink>
                    <NavLink to={"/"}>Privacy Policy</NavLink>
                    <NavLink to={"/"}>FAQs</NavLink>
                </ul>
            </div>
            <div className="footer-info">
                <p>&copy; 2025 FAM MED. All right reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;