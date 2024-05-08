import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "./Navbar.css";

import PropTypes from 'prop-types';

const Navbar = ({ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setIsAdmin(email === 'maicoll.ariza.c@gmail.com');
  }, [setIsAdmin]);




  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  const logout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("email");
    removeActive();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar backgorund-info">
          <Link to="/" className="logo" onClick={removeActive}>
            Library
          </Link>
          <ul className={`navMenu ${isActive ? "active" : ""}`}>
            <li onClick={removeActive}>
              <Link to="/" className="navLink">
                Inicio
              </Link>
            </li>
            {!isAuthenticated && (
              <li onClick={removeActive}>
              <Link to="/login" className="navLink">
                Login
              </Link>
            </li>
            )}
            {isAuthenticated && (
              <li onClick={removeActive}>
              <Link to="/libros" className="navLink">
                Libros
              </Link>
            </li>
            )}
            {
              (isAdmin && isAuthenticated)  && (
                <li onClick={removeActive}>
                <Link to="/admin" className="navLink">
                  Admin
                </Link>
              </li>
              )
            }

            {isAuthenticated && (
            <li  onClick={logout}>
              {/* <Link to="/contacto" className="navLink">
                Logout
              </Link> */}
              <a className="navLink">
                Logout  
              </a>
            </li>
            )}
          </ul>
          <div
            className={`hamburger ${isActive ? "active" : ""}`}
            onClick={toggleActiveClass}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </header>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  setIsAdmin: PropTypes.func.isRequired,
}

export default Navbar;
