import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AboutMe from "./components/About";
import CreateUser from "./components/createuser";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import VideoPlayer from "./components/videoPlayer";
import UploadVideo from "./components/uploadVideo";
import UserHeader from "./components/userHeader";
import ForgotPassword from "./components/forgotPassword";
import UploadPage from "./components/createuser";
// import HomePage from "./components/Home";

const AppRouter = ({ currentUser, handleLogout, setNavigate, handleLogin }) => {
  return (
    <div>
      <UserHeader isLoggedIn={!!currentUser} handleLogout={handleLogout} handleLogin={handleLogin}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage setNavigate={setNavigate} />} />
        <Route path="/video/:videoName" element={<VideoPlayer />} />
        {/* <Route path="/https://www.youtube.com/upload" /> */}
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default AppRouter;