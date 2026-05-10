import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assests from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const Sidebar = () => {

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // IMAGE PREVIEW STATES
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  // FILTER USERS
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // GET USERS
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoadingUsers(true);

        await getUsers();

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingUsers(false);

      }
    };

    fetchUsers();

  }, []);

  return (

    <div
      className={`
        bg-[#8185B2]/10
        h-full
        p-5
        rounded-r-xl
        overflow-y-scroll
        text-white
        transition-all duration-300
        relative
        ${selectedUser ? "max-md:hidden" : ''}
      `}
    >

      {/* TOP */}
      <div className='pb-5'>

        {/* HEADER */}
        <div className='flex justify-between items-center'>

          <img
            src={assests.logo}
            alt='logo'
            className='max-w-40 select-none'
          />

          {/* MENU */}
          <div className='relative py-2'>

            <img
              src={assests.menu_icon}
              alt='menu'
              className='max-h-5 cursor-pointer hover:scale-110 transition'
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {menuOpen && (

              <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-xl'>

                <p
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className='cursor-pointer text-sm hover:text-violet-400 transition'
                >
                  Edit profile
                </p>

                <hr className='my-2 border-t border-gray-500' />

                <p
                  className='cursor-pointer text-sm hover:text-red-400 transition'
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </p>

              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5 transition-all focus-within:ring-2 focus-within:ring-violet-500'>

          <img
            src={assests.search_icon}
            alt='search'
            className='w-3 opacity-70'
          />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search user...'
          />

        </div>

      </div>

      {/* USERS */}
      <div className='flex flex-col'>

        {loadingUsers ? (

          <div className='flex flex-col gap-3 mt-4'>

            {[...Array(6)].map((_, index) => (

              <div
                key={index}
                className='flex items-center gap-3 p-3 rounded-lg animate-pulse bg-white/5'
              >

                <div className='w-10 h-10 rounded-full bg-gray-600'></div>

                <div className='flex flex-col gap-2'>
                  <div className='w-24 h-3 rounded bg-gray-600'></div>
                  <div className='w-14 h-2 rounded bg-gray-700'></div>
                </div>

              </div>

            ))}

          </div>

        ) : filteredUsers.length > 0 ? (

          filteredUsers.map((user, index) => (

            <div
              key={index}
              className={`
                relative
                flex
                items-center
                gap-3
                p-3
                rounded-xl
                cursor-pointer
                transition-all
                duration-200
                hover:bg-[#282142]/40
                active:scale-[0.98]
                ${selectedUser?._id === user._id && 'bg-[#282142]/50'}
              `}
              onClick={() => {

                setSelectedUser(user);

                setUnseenMessages(prev => ({
                  ...prev,
                  [user._id]: 0
                }));

              }}
            >

              {/* PROFILE */}
              <div className='relative'>

                <img
                  src={
                    user.profilePic === ""
                      ? assests.avatar_icon
                      : user.profilePic
                  }
                  className='
                    w-[42px]
                    h-[42px]
                    rounded-full
                    object-cover
                    cursor-pointer
                    hover:scale-110
                    transition
                  '
                  alt='profile'
                  onClick={(e) => {

                    e.stopPropagation();

                    setSelectedImage(
                      user.profilePic === ""
                        ? assests.avatar_icon
                        : user.profilePic
                    );

                    setShowImage(true);

                  }}
                />

                {/* ONLINE STATUS */}
                <span
                  className={`
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    rounded-full
                    border-2
                    border-[#1F2937]
                    ${onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-500"}
                  `}
                ></span>

              </div>

              {/* USER INFO */}
              <div className='flex flex-col leading-5 flex-1 overflow-hidden'>

                <p className='truncate'>
                  {user.fullName}
                </p>

                <span
                  className={`
                    text-xs
                    ${onlineUsers.includes(user._id)
                      ? "text-green-400"
                      : "text-neutral-400"}
                  `}
                >
                  {onlineUsers.includes(user._id)
                    ? "Online"
                    : "Offline"}
                </span>

              </div>

              {/* UNSEEN MESSAGES */}
              {unseenMessages[user._id] > 0 && (

                <p className='absolute top-3 right-3 text-xs min-w-5 h-5 px-1 flex justify-center items-center rounded-full bg-violet-500 text-white'>

                  {unseenMessages[user._id]}

                </p>

              )}

            </div>
          ))

        ) : (

          <div className='text-center text-sm text-gray-400 mt-10'>
            No users found
          </div>

        )}

      </div>

      {/* IMAGE PREVIEW */}
      {showImage && (

        <div
          className='
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-5
          '
        >

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setShowImage(false)}
            className='
              absolute
              top-5
              right-5
              text-white
              text-5xl
              hover:scale-110
              transition
            '
          >
            ×
          </button>

          {/* IMAGE */}
          <img
            src={selectedImage}
            alt='preview'
            className='
              max-w-full
              max-h-[90vh]
              rounded-2xl
              shadow-2xl
              object-contain
            '
          />

        </div>

      )}

    </div>
  )
}

export default Sidebar