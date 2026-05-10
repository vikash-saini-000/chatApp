import React from 'react'
import { useEffect, useState, useContext } from 'react'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [msgImages, setMsgImages] = useState([])

  // IMAGE PREVIEW STATES
  const [showImage, setShowImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  // GET IMAGES
  useEffect(() => {

    setMsgImages(
      messages
        .filter(msg => msg.image)
        .map(msg => msg.image)
    )

  }, [messages])

  return selectedUser && (

    <div className={`
      bg-[#8185B2]/10
      text-white
      w-full
      relative
      overflow-y-scroll
      ${selectedUser ? "max-md:hidden" : ""}
    `}>

      {/* PROFILE */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>

        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className='
            w-20
            aspect-[1/1]
            rounded-full
            object-cover
            cursor-pointer
            hover:scale-105
            transition
          '
          onClick={() => {
            setSelectedImage(
              selectedUser?.profilePic || assets.avatar_icon
            )
            setShowImage(true)
          }}
        />

        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>

          {onlineUsers.includes(selectedUser._id) &&
            <p className='w-2 h-2 rounded-full bg-green-500'></p>}

          {selectedUser.fullName}

        </h1>

        <p className='px-10 mx-auto text-center text-gray-300'>
          {selectedUser.bio}
        </p>

      </div>

      <hr className='border-[#ffffff50] my-4'></hr>

      {/* MEDIA */}
      <div className='px-5 text-xs'>

        <p className='text-sm mb-3 text-gray-300'>
          Shared Media
        </p>

        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>

          {msgImages.length > 0 ? (

            msgImages.map((url, index) => (

              <div
                key={index}
                className='cursor-pointer rounded overflow-hidden group relative'
                onClick={() => {
                  setSelectedImage(url)
                  setShowImage(true)
                }}
              >

                <img
                  src={url}
                  alt={`media-${index}`}
                  className='
                    h-full
                    rounded-md
                    hover:scale-105
                    transition
                    duration-300
                  '
                />

              </div>
            ))

          ) : (

            <p className='text-gray-400 text-xs col-span-2 text-center mt-4'>
              No shared media yet
            </p>

          )}

        </div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => logout()}
        className='
          absolute bottom-5 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-purple-400 to-violet-600
          text-white border-none font-light px-20 py-2 rounded-full
          text-sm cursor-pointer
          hover:scale-105 active:scale-95 transition-all duration-200
          shadow-lg
        '
      >
        Logout
      </button>

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

export default RightSidebar