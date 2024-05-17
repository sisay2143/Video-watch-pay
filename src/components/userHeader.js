import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './userheader.css';

const UserHeader = ({ isLoggedIn, handleLogout }) => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        const userRole = userDoc.data().role;
        setUserRole(userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserRole();
    } else {
      setUserRole('');
    }
  }, [isLoggedIn, auth.currentUser, firestore]);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="user-header">
      <nav>
        <ul className="navigation-links">
          <li>
            <Link to="/" className="home-link">Home</Link>
          </li>
          <li>
            <div className="search-container">
              <input type="text" placeholder="Search" className="search-input" />
              <i className="fas fa-search search-icon"></i>
            </div>
          </li>
          {userRole === 'admin' && (
            <>
              <li>
                <Link to="/upload" className="upload-link right-side">Upload Video</Link>
              </li>
              <li>
                <Link to="/create-user" className="create-user-link right-side">Create User</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/about" className="about-link right-side">About</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button ">Logout</button>
            ) : (
              <button onClick={handleLogin} className="login-button ">Login</button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserHeader;
