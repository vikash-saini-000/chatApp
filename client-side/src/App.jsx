import React ,{useContext}from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster></Toaster>
      <Routes>
        <Route path='/' element={authUser ?<HomePage />:<Navigate to="/login"></Navigate>} />
        <Route path='/login' element={!authUser ? <LoginPage />:<Navigate to="/"></Navigate>} />
        <Route path='/profile' element={authUser ?<ProfilePage/>:<Navigate to="/login"></Navigate>} />
      </Routes>
      
      
    </div>
  )
}

export default App
