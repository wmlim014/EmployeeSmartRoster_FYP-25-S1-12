import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // import useLocation
import "./landingNavBar.css";
import logo from "../../../public/assets/Logo.png";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // get current route

  const isPreviewPage = location.pathname === "/preview-landing-page";

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  const handleScrollToSection = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault(); // Prevent the default anchor behavior
  
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // This enables smooth scrolling
        block: "start", // Align to the start of the section
      });
    }
  };

  return (
    <>
      <nav className="landing-navbar-navbar">
        <div className="landing-navbar-navbar-container">
          {/* Left Section: Logo & Brand */}
          <div className="landing-navbar-navbar-left">
            <span className="landing-navbar-brand">
              <img src={logo} alt="Logo" className="landing-navbar-brand-logo" />
              EmpRoster
            </span>
          </div>

          {/* Right Section (Desktop Menu) */}
          <div className="landing-navbar-navbar-right landing-navbar-desktop-menu">
            <div className="landing-navbar-menu-wrapper">
              <a href="#subscription" className="landing-navbar-nav-link"onClick={(e) => handleScrollToSection(e, "subscription")}>Plans</a>
              <a href="#reviews" className="landing-navbar-nav-link" onClick={(e) => handleScrollToSection(e, "reviews")}>Reviews</a>
              <a href="#faq" className="landing-navbar-nav-link"  onClick={(e) => handleScrollToSection(e, "faq")}>FAQ</a>
              <button
                className="landing-navbar-nav-button"
                onClick={handleLoginClick}
                disabled={isPreviewPage}
              >
                Login
              </button>
              <button
                className="landing-navbar-nav-button"
                onClick={handleRegisterClick}
                disabled={isPreviewPage}
              >
                Register
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="landing-navbar-mobile-hamburger" onClick={toggleMobileMenu}>
            <span className="landing-navbar-hamburger-icon"></span>
            <span className="landing-navbar-hamburger-icon"></span>
            <span className="landing-navbar-hamburger-icon"></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="landing-navbar-mobile-menu">
          <a href="#subscription" className="landing-navbar-nav-link" onClick={closeMobileMenu}>Plans</a>
          <a href="#reviews" className="landing-navbar-nav-link" onClick={closeMobileMenu}>Reviews</a>
          <a href="#faq" className="landing-navbar-nav-link" onClick={closeMobileMenu}>FAQ</a>
          <button
            className="landing-navbar-nav-button"
            onClick={() => { closeMobileMenu(); handleLoginClick(); }}
            disabled={isPreviewPage}
          >
            Login
          </button>
          <button
            className="landing-navbar-nav-button"
            onClick={() => { closeMobileMenu(); handleRegisterClick(); }}
            disabled={isPreviewPage}
          >
            Register
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
