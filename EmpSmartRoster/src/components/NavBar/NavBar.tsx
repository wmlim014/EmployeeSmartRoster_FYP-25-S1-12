import { useAuth } from "../../AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../controller/Variables.js";
import SideMenu_m from "../SideMenu/SideMenu_m";
// Import resources
import { LuLogOut, CgProfile } from "../../../public/Icons.js";
import LogoutController from '../../controller/User/LogoutController';
import appLogo from "../../../public/assets/Logo.png";

import "./NavBar.css"; 
import "../../../public/styles/common.css";

const { LogUserOut } = LogoutController;

const Navbar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isOnLanding = location.pathname.includes('home');
    const isOnLogin = location.pathname.includes('login');
    const isOnRegister = location.pathname.includes('register');
    const isOnReqResetEmail = location.pathname.includes('request-reset-pw-email');
    const isOnResetPw = location.pathname.includes('reset-pw');
    const isOnPreviewLanding = location.pathname.includes('preview-landing-page');

    const handleLogout = async () => {
        try{
            const response = await LogUserOut(user?.UID);
        
            if(response.message === 'Logout successful'){
                logout(); // Call the logout function from AuthContext
                navigate("/"); // Redirect to the login page
            }
            
        } catch (err){
            logout(); // Call the logout function from AuthContext
            navigate("/"); // Redirect to the login page
            // Return this later
            // console.error("Logout failed:", err);
            // alert("Logout failed. Please try again.");
        }
    };

    const handleLoginClick = () => navigate("/login");
    const handleRegisterClick = () => navigate("/register");

    const handleScrollToSection = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL
            // window.history.pushState(null, '', `#${targetId}`);
        }
    };

    return (
        <>
            {isLoggedIn 
             && !isOnLanding
             && !isOnLogin
             && !isOnRegister
             && !isOnReqResetEmail
             && !isOnResetPw 
             && !isOnPreviewLanding
             && (
                <div className="navbar">
                    <div className="nav-button hamburger-menu-icon">
                        <SideMenu_m />
                    </div>
                    <div className="front">
                        {user?.role === USER_ROLE[0] && (
                            <Link to="/admin-dashboard" className="nav-link">
                                <img src={appLogo} alt="Dashboard"></img>
                            </Link>
                        )}
                        {user?.role === USER_ROLE[1] && (
                            <Link to="/business-dashboard" className="nav-link">
                                <img src={appLogo} alt="Dashboard"></img>
                            </Link>
                        )}
                        {user?.role === USER_ROLE[2] && (
                            <Link to="/my-schedule" className="nav-link">
                                <img src={appLogo} alt="Dashboard"></img>
                            </Link>
                        )}
                        <span className="nav-user-role">Welcome back, {user?.role}</span>
                    </div>
                    <div className="btn-group">
                        {user?.role !== "System Admin" && (
                            <Link to="/user-profile" className="nav-link">
                                <button className="nav-button">
                                    <CgProfile />
                                </button>
                            </Link>
                        )}
                        <LuLogOut 
                            onClick={handleLogout} 
                            className="nav-button"
                        />
                    </div>
                </div>
            )}
            
            {isOnLanding && (
                <div className="navbar">
                    <div className="nav-button hamburger-menu-icon">
                        <SideMenu_m/>
                    </div>
                    <div className="front">
                        <a href="#faq" className="nav-link" onClick={(e) => handleScrollToSection(e, "top")}> 
                            <img src={appLogo} alt="Dashboard"></img>
                        </a>
                    </div>

                    <div className="landing-navbar-navlink-group"> 
                        <a href="#demo" 
                            className="landing-navbar-navlink"
                            onClick={(e) => handleScrollToSection(e, "demo")}>
                        Demo
                        </a>
                        <a href="#subscription" 
                            className="landing-navbar-navlink" 
                            onClick={(e) => handleScrollToSection(e, "subscription")}>
                            Subscription
                        </a>
                        <a href="#reviews" 
                            className="landing-navbar-navlink" 
                            onClick={(e) => handleScrollToSection(e, "reviews")}>
                            Reviews
                        </a>
                        <a href="#faq" 
                            className="landing-navbar-navlink"
                            onClick={(e) => handleScrollToSection(e, "faq")}>
                            FAQ
                        </a>
                    </div>

                    <div className="btn-group">
                        <div className="landing-navbar-LR">
                            <button
                                className="landing-navbar-button-LR"
                                onClick={handleLoginClick}
                                disabled={isOnPreviewLanding}
                            >
                                Login
                            </button>
                            <button
                                className="landing-navbar-button-LR"
                                onClick={handleRegisterClick}
                                disabled={isOnPreviewLanding}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(isOnLogin 
            || isOnRegister
            )
            &&(
                <div className="navbar">
                    <div className="nav-button hamburger-menu-icon">
                    <SideMenu_m />
                    </div>
                    <div className="front">
                    <a href="#faq" className="nav-link" onClick={(e) => navigate('/home')}> 
                        <img src={appLogo} alt="Dashboard" />
                    </a>
                    </div>
                    <div className="btn-group">
                    <div className="landing-navbar-LR">
                        {/* Conditionally Render Buttons */}
                        {!isOnLogin && (
                        <button
                            className="landing-navbar-button-LR"
                            onClick={handleLoginClick}
                            disabled={isOnPreviewLanding}
                        >
                            Login
                        </button>
                        )}
                        {!isOnRegister && (
                        <button
                            className="landing-navbar-button-LR"
                            onClick={handleRegisterClick}
                            disabled={isOnPreviewLanding}
                        >
                            Register
                        </button>
                        )}
                    </div>
                    </div>
                </div>
            )}
            {isOnPreviewLanding 
            && (
                <div className="navbar">
                    <div className="nav-button hamburger-menu-icon">
                        <SideMenu_m/>
                    </div>
                    <div className="front">
                        <a href="#faq" className="nav-link" onClick={(e) => handleScrollToSection(e, "top")}> 
                            <img src={appLogo} alt="Dashboard"></img>
                        </a>
                    </div>

                    <div className="landing-navbar-navlink-group"> 
                        <a href="#demo" 
                            className="landing-navbar-navlink"
                            onClick={(e) => handleScrollToSection(e, "demo")}>
                        Demo
                        </a>
                        <a href="#subscription" 
                            className="landing-navbar-navlink" 
                            onClick={(e) => handleScrollToSection(e, "subscription")}>
                            Subscription
                        </a>
                        <a href="#reviews" 
                            className="landing-navbar-navlink" 
                            onClick={(e) => handleScrollToSection(e, "reviews")}>
                            Reviews
                        </a>
                        <a href="#faq" 
                            className="landing-navbar-navlink"
                            onClick={(e) => handleScrollToSection(e, "faq")}>
                            FAQ
                        </a>
                    </div>

                    <div className="btn-group">
                        <div className="landing-navbar-LR">
                            <button
                                className="landing-navbar-button-LR"
                                onClick={handleLoginClick}
                                disabled={isOnPreviewLanding}
                            >
                                Login
                            </button>
                            <button
                                className="landing-navbar-button-LR"
                                onClick={handleRegisterClick}
                                disabled={isOnPreviewLanding}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
        
    );
};

export default Navbar;