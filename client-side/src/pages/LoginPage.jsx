import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { login } = useContext(AuthContext);

  // Helper for email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss(); // Prevents multiple toast stacks

    // --- 1. COMMON VALIDATION ---
    if (!agree) {
      return toast.error("Please accept terms & privacy policy");
    }

    // --- 2. SIGN UP: STEP 1 (Initial Details) ---
    if (currState === "Sign up" && !isDataSubmitted) {
      if (!fullName.trim()) return toast.error("Please enter your full name");
      if (fullName.trim().length < 3) return toast.error("Name must be at least 3 characters");
      
      if (!email.trim()) return toast.error("Email address is required");
      if (!isValidEmail(email)) return toast.error("Please enter a valid email address");
      
      if (!password) return toast.error("Password is required");
      if (password.length < 6) return toast.error("Password must be at least 6 characters");

      setIsDataSubmitted(true);
      return;
    }

    // --- 3. SIGN UP: STEP 2 (Bio Submission) ---
    if (currState === "Sign up" && isDataSubmitted) {
      if (!bio.trim()) return toast.error("Please write a short bio about yourself");
      if (bio.trim().length < 10) return toast.error("Bio should be at least 10 characters");
    }

    // --- 4. LOGIN VALIDATION ---
    if (currState === "Login") {
      if (!email.trim()) return toast.error("Email is required to login");
      if (!isValidEmail(email)) return toast.error("Please enter a valid email format");
      if (!password) return toast.error("Password is required");
    }

    // --- 5. FINAL API SUBMISSION ---
    try {
      setLoading(true);
      if (currState === "Sign up") setUploading(true);

      await login(
        currState === "Sign up" ? "signup" : "login",
        { fullName: fullName.trim(), email: email.trim(), password, bio: bio.trim() }
      );

    } catch (error) {
      toast.error(error?.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-2xl bg-black/20 bg-[url('/bgImage.svg')] bg-center bg-cover">
        <div className="flex space-x-3">
          <span className="w-4 h-4 bg-white rounded-full animate-bounce"></span>
          <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
        <p className="text-white mt-5 text-sm font-medium">
          {uploading ? "Creating your account..." : "Securing your session..."}
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl px-4'>
      
      <img src={assets.logo_big} alt="Logo" className='w-[min(30vw,250px)]' />

      <form
        noValidate
        className='border-2 bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-5 rounded-xl shadow-2xl backdrop-blur-md w-full max-w-[400px]'
        onSubmit={handleSubmit}
      >
        <h2 className='font-semibold text-2xl flex justify-between items-center capitalize'>
          {currState}
          {isDataSubmitted && currState === "Sign up" && (
            <img
              src={assets.arrow_icon}
              alt="Back"
              className='w-5 cursor-pointer rotate-180 opacity-70 hover:opacity-100 transition-all'
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {/* Dynamic Fields */}
        {!isDataSubmitted ? (
          <>
            {currState === "Sign up" && (
              <input
                type="text"
                placeholder='Full Name'
                className='border border-gray-500 bg-transparent rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all'
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="p-2.5 border border-gray-500 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2.5 border border-gray-500 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        ) : (
          <textarea
            rows={4}
            placeholder="Tell us a bit about yourself (Bio)..."
            className="p-2.5 border border-gray-500 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-all"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 mt-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-md cursor-pointer hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-95"
        >
          {currState === "Sign up" ? (isDataSubmitted ? "Finalize Account" : "Next Step") : "Login Now"}
        </button>

        <div className="flex items-start gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            id="agree"
            className="mt-1 accent-violet-500 w-4 h-4 cursor-pointer"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree" className="cursor-pointer leading-tight select-none">
            I agree to the terms of use & privacy policy.
          </label>
        </div>

        <div className="mt-2 border-t border-gray-600 pt-4">
          <p className="text-sm text-gray-400 text-center">
            {currState === "Sign up" ? "Already have an account? " : "New here? "}
            <span
              className="font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors"
              onClick={() => {
                setCurrState(currState === "Sign up" ? "Login" : "Sign up");
                setIsDataSubmitted(false);
              }}
            >
              {currState === "Sign up" ? "Login here" : "Create one now"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;