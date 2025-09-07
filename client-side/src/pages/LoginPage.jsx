import React from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'


const LoginPage = () => {
  let [currState, setCurrState] = useState("Sign up") ;
  let [fullName, setFullname] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [bio, setBio] = useState("")
  let [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const {login} = React.useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      // Proceed to the next step to collect bio
      setIsDataSubmitted(true);
      return
    }
    // Handle form submission logic here
    login(currState === "Sign up" ? "signup":"login",{fullName,email,password,bio})
   }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
  
      {/* -------- left -------- */}
      <img 
        src={assets.logo_big} 
        alt="" 
        className='w-[min(30vw,250px)]' 
      />

      {/* -------- right -------- */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' onSubmit={handleSubmit}>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
         {isDataSubmitted &&  <img 
            src={assets.arrow_icon} 
            alt="" 
            className='w-5 cursor-pointer' 
            onClick={() => setIsDataSubmitted(false)}
          />}
        </h2>
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            placeholder='Full Name'
            className='border border-gray-500 rounded-md p-2  focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={fullName}
            onChange={e => setFullname(e.target.value)}
            required
          />
        )}
        {!isDataSubmitted && (
        <>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </>
        )}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span className="font-medium text-violet-500 cursor-pointer" onClick={() => {
                setCurrState("Login")
                setIsDataSubmitted(false)
              }}>
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span className="font-medium text-violet-500 cursor-pointer"
              onClick={() => {
                setCurrState("Sign up")
                setIsDataSubmitted(false)
              }}>
                Click here
              </span>
            </p>
          )}
        </div>



      </form>
    </div>
        
   
  )
}

export default LoginPage
