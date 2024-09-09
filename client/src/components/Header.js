import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import logo from './logo_wbg.png';  

const Header = () => {
  return (
    <header>
      <div className="logo-title">
        <img src={logo} alt="CertiGuard Logo" className="logo" />
        <h1>CertiGuard</h1>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/students">Students</Link>
        <Link to="/universities">Universities</Link>
        <Link to="/certificates">Certificates</Link>
      </nav>
    </header>
  );
};

export default Header;
