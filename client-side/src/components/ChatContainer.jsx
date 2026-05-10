import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { FormatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

const ChatContainer = () => {

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // IMAGE PREVIEW STATES
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // SEND TEXT MESSAGE
  const handleSendMessage = async () => {

    if (!input.trim() || sendingMessage) return;

    try {

      setSendingMessage(true);

      await sendMessage({
        text: input,
      });

      setInput("");

    } catch (error) {

      toast.error("Failed to send message", {
        duration: 2500,
      });

    } finally {

      setSendingMessage(false);

    }
  };

  // SEND IMAGE
  const handleSendImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      setSendingImage(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "chatApp-unsigned");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtg8lxnyl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      await sendMessage({
        image: data.secure_url,
      });

      toast.success("Image sent", {
        duration: 2000,
      });

      e.target.value = "";

    } catch (error) {

      toast.error("Failed to send image", {
        duration: 2500,
      });

    } finally {

      setSendingImage(false);

    }
  };

  // LOAD MESSAGES
  useEffect(() => {

    const loadMessages = async () => {

      if (!selectedUser) return;

      setLoadingMessages(true);

      await getMessages(selectedUser._id);

      setLoadingMessages(false);
    };

    loadMessages();

  }, [selectedUser]);

  // AUTO SCROLL
  useEffect(() => {

    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({
        behavior: "smooth",
      });
    }

  }, [messages]);

  // EMPTY SCREEN
  if (!selectedUser)
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">

        <img
          src={assets.logo_icon}
          className="max-w-16"
          alt="logo"
        />

        <p className="text-white text-xl font-medium">
          Welcome to QuickChat ✨
        </p>

        <span className="text-gray-400 text-sm">
          Select a conversation to start chatting
        </span>

      </div>
    );

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">

      {/* LOADER */}
      {(loadingMessages || sendingImage) && (

        <div className="
          absolute inset-0
          z-50
          flex flex-col items-center justify-center
          backdrop-blur-xl
          bg-black/20
          rounded-2xl
        ">

          <div className="flex space-x-3">
            <span className="w-4 h-4 bg-white rounded-full animate-bounce"></span>
            <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>

          <p className="text-white text-sm mt-4">
            {sendingImage
              ? "Uploading image..."
              : "Loading messages..."}
          </p>

        </div>

      )}

      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">

        <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className="
              w-8
              h-8
              rounded-full
              object-cover
              cursor-pointer
              hover:scale-110
              transition
            "
            alt="profile"
            onClick={() => {
              setSelectedImage(
                selectedUser.profilePic || assets.avatar_icon
              );
              setShowImage(true);
            }}
          />

        <p className="flex-1 text-lg text-white flex items-center gap-2">

          {selectedUser.fullName}

          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}

        </p>

        <img
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          onClick={() => setSelectedUser(null)}
          alt="back"
        />

        <img
          src={assets.help_icon}
          className="max-md:hidden max-w-5"
          alt="help"
        />
      </div>

      {/* MESSAGES */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex items-end gap-2 mb-3 animate-fadeIn ${
              msg.senderId === authUser._id
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser.profilePic || assets.avatar_icon}
                className="w-7 h-7 rounded-full"
                alt="avatar"
              />
            )}

            <div
              className={`max-w-[230px] ${
                msg.senderId === authUser._id
                  ? "items-end text-right"
                  : "items-start text-left"
              }`}
            >

              {msg.image ? (

                <img
                  src={msg.image}
                  className={`w-full rounded-lg border cursor-pointer hover:scale-[1.02] transition ${
                    msg.senderId === authUser._id
                      ? "bg-violet-500/30 rounded-bl-none border-violet-400/40"
                      : "bg-gray-700/40 rounded-br-none border-gray-600/40"
                  }`}
                  alt="message"
                  onClick={() => {
                    setSelectedImage(msg.image);
                    setShowImage(true);
                  }}
                />

              ) : (

                <p
                  className={`p-2 text-sm font-light rounded-lg break-words text-white shadow-md backdrop-blur-md transition-all duration-200 ${
                    msg.senderId === authUser._id
                      ? "bg-violet-500/30 rounded-bl-none"
                      : "bg-gray-700/40 rounded-br-none"
                  }`}
                >
                  {msg.text}
                </p>

              )}

              <p className="text-[10px] text-gray-400 mt-1">
                {FormatMessageTime(msg.createdAt)}
              </p>

            </div>

            {msg.senderId === authUser._id && (
              <img
                src={authUser.profilePic || assets.avatar_icon}
                className="w-7 h-7 rounded-full"
                alt="avatar"
              />
            )}

          </div>
        ))}

        <div ref={scrollEnd}></div>

      </div>

      {/* INPUT */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">

        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">

          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSendMessage()
            }
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />

          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor="image">

            <img
              src={assets.gallery_icon}
              alt="upload"
              className="w-5 mr-2 cursor-pointer hover:scale-110 transition"
            />

          </label>

        </div>

        <img
          src={assets.send_button}
          alt="send"
          onClick={handleSendMessage}
          className={`
            w-7
            cursor-pointer
            transition
            ${sendingMessage
              ? "opacity-50 pointer-events-none"
              : "hover:scale-110"}
          `}
        />

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
  );
};

export default ChatContainer;