import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">Takım Yönetimi</NavLink>
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            Ana Sayfa
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/diagram" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Diyagram
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/charts" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Grafikler
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;