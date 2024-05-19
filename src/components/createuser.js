import React, { useState } from "react";
import { auth, firestore } from "../firebase"; // Assuming your firebase.js file is in the same directory
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./createuser.css";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Add the user to Firestore users collection
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        name: displayName,
        role: role, // Add role field
      });

      // Clear input fields and errors
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRole("");
      setError(null);

      console.log("User created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="createUserContainer">
      <h2>Create User</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser}>Create User</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default CreateUser;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const UploadPage = () => {
//   const navigate = useNavigate();

//   const handleUploadClick = () => {
//     // Construct the YouTube uploader URL
//     const youtubeUploaderUrl = 'https://www.youtube.com/upload';

//     // Navigate to the YouTube uploader page
//     window.open(youtubeUploaderUrl, '_blank');

//     // Optionally, you can redirect the user back to the home page or another route
//     navigate('/');
//   };

//   return (
//     <div className="upload-page">
//       <h1>Upload Video</h1>
//       <button onClick={handleUploadClick}>Upload to YouTube</button>
//     </div>
//   );
// };

// export default UploadPage;