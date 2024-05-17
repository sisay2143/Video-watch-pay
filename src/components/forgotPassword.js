import React, { useState } from "react";
import { auth } from '../firebase'; // Assuming your firebase.js file is in the same directory
import './forgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Check if the entered email is associated with an authenticated user
      const signInMethods = await auth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length === 0) {
        setErrorMessage("The email is not associated with an authenticated user.");
        return;
      }

      await auth.sendPasswordResetEmail(email);
      setMessage("Password reset email sent. Please check your inbox.");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setMessage("");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword} className="forgot-password-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className="message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ForgotPassword;