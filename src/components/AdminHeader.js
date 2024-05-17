// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'
// import AboutMe from './About';

const AdminHeader = () => {
  return (
    <div className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/create-user">Create User</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminHeader;


