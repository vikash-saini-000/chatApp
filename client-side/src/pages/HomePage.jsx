import React from 'react'
import { useState } from 'react'
import ChatContainer from '../components/ChatContainer.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'


const HomePage = () => {
  const {selectedUser} = React.useContext(ChatContext);

  
  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
        <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 realtive ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
          <Sidebar></Sidebar>

          <ChatContainer ></ChatContainer>
          <RightSidebar></RightSidebar>
          
        </div >
       
      
    </div>
  )
}

export default HomePage
