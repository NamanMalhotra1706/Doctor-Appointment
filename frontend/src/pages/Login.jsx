import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext.jsx";
import { signInWithGoogle } from "../firebase-confiig.js/firebase.js"; // Import the function for Google sign-in
import HashLoader from "react-spinners/HashLoader.js";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
//import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      console.log(userCredential);
      if (!userCredential) {
        throw new Error("User credential is undefined");
      }
      const { user } = userCredential.proactiveRefresh; // Correctly access the user
      const user1 = user;
      if (!user1) {
        throw new Error("User is undefined in user credential");
      }
      console.log("Google Sign-In Success:", user1);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: null, // No traditional user data from backend for Google sign-in
          token: user.za, // Access token from Google user object
          role: "googleUser", // Example role for Google users
          user1: user1, // Store the Google user object
        },
      });
      toast.success("Successfully signed in with Google");
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      toast.error("Google sign-in failed. Please try again later.");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // JWT sign-in logic
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });
      console.log(result, "login data");
      toast.success(result.message);
      navigate("/home");
    } catch (jwtError) {
      // If JWT sign-in fails, attempt Google sign-in
      console.error("JWT Sign-In Error:", jwtError.message);
      try {
        await handleGoogleSignIn();
      } catch (googleError) {
        console.error("Google Sign-In Error:", googleError.message);
        toast.error("Sign-in failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span>Back
        </h3>

        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              placeholder="Enter Your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
              required
            />
          </div>
          <div className="mt-7">
            <button className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
              {loading ? <HashLoader size={25} color="#fff" /> : "Login"}
            </button>
          </div>

          {/* Google Sign-In button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 hover:bg-red-600 transition duration-300"
            >
              Sign in with Google
            </button>
          </div>

          {/* Register link */}
          <p className="mt-5 text-textColor text-center">
            Don&apos;t have an account?
            <Link
              to="/register"
              className="text-primaryColor font-medium ml-1 transition duration-300 hover:text-red-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
