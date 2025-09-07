import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import assests from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const Sidebar = () => {
  const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages} = React.useContext(ChatContext);
  const {logout,onlineUsers} = React.useContext(AuthContext);
  const [input,setInput] = React.useState(false);
    const navigate = useNavigate();
    const filteredUsers =input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())): users;
    useEffect(()=>{
      getUsers();

    },[onlineUsers])
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center '>
          <img src={assests.logo} alt='logo' className='max-w-40'></img>
          <div className='relative py-2 group'>
            <img src={assests.menu_icon} alt='menu' className='max-h-5 cursor-pointer'></img>
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={()=>navigate("/profile")} className='cursor-pointer text-sm'>Edit profile</p>
              <hr className='my-2 border-t border-gray-500'></hr>
              <p className='cursor-pointer text-sm' onClick={()=>logout()}>Logout</p>


            </div>
          </div>

        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assests.search_icon} alt='search' className='w-3'></img>
          <input onChange={(e)=>setInput(e.target.value)}type='text' className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search user ...'></input>

        </div>


      </div>
      <div className='flex flex-col '>
        {filteredUsers.map((user,index)=>(
          <div className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id===user._id && 'bg-[#282142]/50'}`} key={index} onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}>
            <img src={user ? user.profilePic:assests.avatar_icon} className='w-[35px] aspect-[1/1] rounded-full' ></img>
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span>:<span className='text-neutral-400 text-xs'>Offline</span>}


            </div>
            {unseenMessages[user._id]>0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/10'>{unseenMessages[user._id]}</p>}

          </div>
        ))}

      </div>
        
      
      
    </div>
  )
}

export default Sidebar
