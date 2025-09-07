import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { FormatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  // Send text message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage({ text: input });
      setInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Send image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Upload to Cloudinary via fetch
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
      if (!data.secure_url) throw new Error("Cloudinary upload failed");

      await sendMessage({ image: data.secure_url });
      e.target.value = "";
    } catch (error) {
      console.error("Send Image Error:", error.message || error);
      toast.error("Failed to send image");
    }
  };

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser)
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="logo" />
        <p className="text-white text-lg font-medium">
          Chat anytime, anywhere
        </p>
      </div>
    );

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
          alt="profile"
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
        <img src={assets.help_icon} className="max-md:hidden max-w-5" alt="help" />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 mb-3 ${
              msg.senderId === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Receiver avatar */}
            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                className="w-7 h-7 rounded-full"
                alt="avatar"
              />
            )}

            {/* Message */}
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
                  className={`w-full rounded-lg border ${
                    msg.senderId === authUser._id
                      ? "bg-violet-500/30 rounded-bl-none border-violet-400/40"
                      : "bg-gray-700/40 rounded-br-none border-gray-600/40"
                  }`}
                  alt="message"
                />
              ) : (
                <p
                  className={`p-2 text-sm font-light rounded-lg break-words text-white ${
                    msg.senderId === authUser._id
                      ? "bg-violet-500/30 rounded-bl-none"
                      : "bg-gray-700/40 rounded-br-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* Timestamp */}
              <p className="text-[10px] text-gray-400 mt-1">
                {FormatMessageTime(msg.createdAt)}
              </p>
            </div>

            {/* Sender avatar */}
            {msg.senderId === authUser._id && (
              <img
                src={authUser?.profilePic || assets.avatar_icon}
                className="w-7 h-7 rounded-full"
                alt="avatar"
              />
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          src={assets.send_button}
          alt="send"
          className="w-7 cursor-pointer"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
