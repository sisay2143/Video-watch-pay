// auth.js - Authentication module
import { auth, firestore } from './firebase';

// Function to check user's role
async function getUserRole() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null; // User not logged in

  try {
    // Get the current user's ID
    const userId = currentUser.uid;
    // Fetch user information from Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    // Check if user document exists and retrieve the role field
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.role || 'user'; // Return user's role, defaulting to 'user' if not found
    } else {
      console.log('User document not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null;
  }
}

export { getUserRole };
