import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AboutMe from "./components/About";
import CreateUser from "./components/createuser";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import VideoPlayer from "./components/videoPlayer";
import UserHeader from "./components/userHeader";
import ForgotPassword from "./components/forgotPassword";
import Footer from "./components/footer";
import UploadVideo from "./components/uploadVideo";
import PrivateRoute from "./protectedRoute";

const AppRouter = ({ currentUser, handleLogout, setNavigate, handleLogin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  

  return (
    <div>
      <UserHeader isLoggedIn={!!currentUser} handleLogout={handleLogout} handleLogin={handleLogin} handleSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home handleSearch={handleSearch} />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage setNavigate={setNavigate} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          element={<PrivateRoute isLoggedIn={!!currentUser} />}
        >
          <Route path="/upload" element={<UploadVideo />} />
        <Route path="/video/:videoName" element={<VideoPlayer />} />
        <Route path="/create-user" element={<CreateUser />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;
