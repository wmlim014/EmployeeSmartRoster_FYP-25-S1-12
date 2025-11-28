import "./Header.css";
import logo from "../../../../public/assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnLandingPage = location.pathname === "/landing-page";

  return (
    <div className={`${className} header-container`}>

      <div>
        <table>
          <td>
            <img src={logo} className="logo2" alt="Logo" />
          </td>
          <td>
            <nav className="nav-menu">
              <ul>
                <li>
                  <a
                    onClick={!isOnLandingPage ? () => navigate("/landing-page") : undefined}
                    style={{
                      cursor: isOnLandingPage ? "default" : "pointer",
                    }}
                  >
                    Home
                  </a>
                </li>
                <li><a onClick={() => navigate("/register")}>Register</a></li>
                <li>
                  <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</a>
                </li>
              </ul>
            </nav>
          </td>
        </table>
      </div>

      {/* Title and Content Sections */}
      <main className="title-section fade-in-top">
        <h1 className="LandingTitle">EmpRoster</h1>
      </main>

      <div className="subtitle fade-in-top">Simplify Employee Scheduling and Timesheets</div>

      <div className="description fade-in-top">
        <p className="description-text">
          Discover how EmpRoster can streamline your employee scheduling process.
        </p>
        <p className="description-text">
          Our innovative application is designed to enhance operational efficiency and boost employee satisfaction.
        </p>
      </div>
    </div>
  );
}
