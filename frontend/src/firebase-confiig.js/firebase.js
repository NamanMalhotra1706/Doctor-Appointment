import { signInWithPopup, getAuth } from "firebase/auth";
import { googleAuthProvider } from "./config.js";

export const signInWithGoogle = async () => {
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    console.log("User signed in with Google:", user);
    // Add your logic here after successful sign-in
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

// Function to sign in with Google
// export const signInWithGoogle = async () => {
//   const auth = getAuth();

//   try {
//     // Create a GoogleAuthProvider instance
//     const provider = new GoogleAuthProvider();

//     // Sign in with Google using a pop-up window
//     const userCredential = await signInWithPopup(auth, provider);

//     // Return the user credential
//     return userCredential;
//   } catch (error) {
//     // Handle errors
//     throw error;
//   }
// };
