import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './userheader.css';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const UserHeader = ({ isLoggedIn, handleLogout }) => {
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
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

  const handleUploadClick = () => {
    // Construct the YouTube uploader URL
    const youtubeUploaderUrl = 'https://www.youtube.com/upload';

    // Navigate to the YouTube uploader page
    window.open(youtubeUploaderUrl, '_blank');

    // Optionally, you can redirect the user back to the home page or another route
    navigate('/');
  };

  // const handleSearch = () => {
  //   const matchingVideos = allVideos.filter((video) => {
  //     const title = video.title.toLowerCase();
  //     const query = searchQuery.toLowerCase();
  //     return (
  //       title.startsWith(query) ||
  //       title.endsWith(query) ||
  //       title.includes(query)
  //     );
  //   });

  //   setFilteredVideos(matchingVideos);
  // };

  const handleSearchIconClick = () => {
    // Enable the search input field
    const searchInput = document.querySelector(".search-bar input");
    searchInput.disabled = false;
    searchInput.focus();
    setSearchQuery('');

    // Perform the search
    // handleSearch();
  };

  return (
    <div className="user-header">
      <nav>
        <ul className="navigation-links">
          <li>
            <Link to="/" className="home-link">Home</Link>
          </li>
          <li>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // handleSearch();
              }}
              disabled={false}
            />
            <FaSearch
              className="search-icon"
              onClick={handleSearchIconClick}
            />
          </div>
          </li>
          {userRole === 'admin' && (
            <>
              <li>
                <Link to="/upload" className="upload-link right-side" >Upload Video</Link>
              </li>
              <li>
                <Link to="/create-user" className="create-user-link right-side">Create User</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/about" className="about-link right-side">About us</Link>
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
