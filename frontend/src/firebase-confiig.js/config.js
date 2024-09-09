// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA8gP7nvP8yzjlPNBelt8dOfVpgL0kqUc",
  authDomain: "doctor-appointment-362af.firebaseapp.com",
  projectId: "doctor-appointment-362af",
  storageBucket: "doctor-appointment-362af.appspot.com",
  messagingSenderId: "112953045896",
  appId: "1:112953045896:web:a63884d65f78a5f356003d",
  measurementId: "G-H4V5DQ8SNF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Google Sign-In Provider
const googleAuthProvider = new GoogleAuthProvider();

export { app, analytics, googleAuthProvider };
