

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { auth } from './firebase';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [navigate, setNavigate] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };
  const handleLogin = async () => {
    try {
      // await auth.signOut();
      // setCurrentUser(null);
    if (!currentUser) 
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Router>
      <AppRouter currentUser={currentUser} handleLogout={handleLogout} handleLogin={handleLogin} setNavigate={setNavigate} />
    </Router>
  );
};

export default App;

