import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
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
            <li onClick={removeActive}>
              <Link to="/libros" className="navLink">
                Libros
              </Link>
            </li>
            <li onClick={removeActive}>
              <Link to="/admin" className="navLink">
                Admin
              </Link>
            </li>
            <li onClick={removeActive}>
              <Link to="/contacto" className="navLink">
                Logout
              </Link>
            </li>
          </ul>
          <div className={`hamburger ${isActive ? "active" : ""}`} onClick={toggleActiveClass}></div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;