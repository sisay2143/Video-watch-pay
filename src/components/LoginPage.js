import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailPassword } from "../login";
import { FaCreditCard } from "react-icons/fa"; // Import FaCreditCard icon
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase"; // Assuming the firestore instance is imported from firebase.js
import { auth } from '../firebase'; // Assuming your firebase.js file is in the same directory
// import '../styles.css'
import './login.css'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to hold authentication errors
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with email:", email);
    console.log("Submitting form with password:", password);
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }
  
    try {
      // Sign in user with email and password
      await signInWithEmailPassword(email, password);
  
      // Redirect to home page after successful login
      navigate("/");
      console.log("User signed in successfully");
    } catch (error) {
      // Handle authentication errors
      console.error("Error signing in:", error.message);
      if (!email) {
        setError("Please enter an email address.");
      } else if (!password) {
        setError("Please enter a password.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred during sign-in. Please try again later.");
      }
    }
  };

  const handlePayment = () => {
    // Redirect user to payment option (e.g., Telegram account) in a new tab
    window.open("https://t.me/sisay_bekele", "_blank");
  };
  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Login Page</h1>
        <h3>To get login username and password, make a payment first.</h3>
        <button className="payment" onClick={handlePayment}>
        Make Payment   <FaCreditCard style={{ marginLeft: '10px' }}/>  {/* Add FaCreditCard icon */}
        </button>
        <br /> <br />
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login" type="submit">Login</button>
          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
