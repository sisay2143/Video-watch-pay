import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailPassword } from "../login";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase"; // Assuming the firestore instance is imported from firebase.js
import { auth } from '../firebase'; // Assuming your firebase.js file is in the same directory
// import '../styles.css'
import './login.css'



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with email:", email);
    console.log("Submitting form with password:", password);
    try {
      // Sign in user with email and password
      await signInWithEmailPassword(email, password);
      
      // Get the user's role from Firestore
      // const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
      // const userRole = userDoc.data().role;

      // Render different content based on user's role
      // if (userRole === "admin") {
      //   // Redirect admin to admin dashboard
      //   navigate("/admin");
      // } else {
      //   // Redirect normal users to regular dashboard
        navigate("/");
      // }

      console.log("User signed in successfully");
    } catch (error) {
      // Handle authentication error
      console.error("Error signing in:", error.message);
    }
  };

  const handlePayment = () => {
    // Redirect user to payment option (e.g., Telegram account)
    window.location.href = "https://t.me/payment";
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Login Page</h1>
        <h3>To get login username and password, make a payment first.</h3>
        <button onClick={handlePayment}>Make Payment</button>
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
          <button type="submit">Login</button>
          <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
