import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import app from './firebase'; // Import the initialized Firebase app
import { auth } from './firebase';
// Get the Firebase Auth instance
// const auth = getAuth(app);

// Function to sign in user with email and password
const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return user object upon successful sign-in
  } catch (error) {
    throw error; // Throw error if sign-in fails
  }
};

export { signInWithEmailPassword };
