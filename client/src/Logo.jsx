import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/mike.png'; // Replace with your logo file path

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/sign-in">
        <img src={logo} alt="Logo" />
      </Link>
    </div>
  );
};

export default Logo;
