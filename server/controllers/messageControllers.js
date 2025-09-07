import Message from "../models/message.js";
import User from "../models/user.js";
import { v2 as cloudinary } from 'cloudinary';
import { io, userSocketMap } from "../server.js";
//fetch users for sidebar except the logged in user

export const getUsersForSidebar = async (req, res) =>{
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

    // Count number of messages not seen
    const unseenMessages = {}
    const promises = filteredUsers.map(async (user)=>{
      const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
      if(messages.length > 0){
        unseenMessages[user._id] = messages.length;
      }
    })
    await Promise.all(promises);
    res.json({success: true, users: filteredUsers, unseenMessages})
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}



// Get all messages for selected user
export const getMessages = async (req, res) =>{
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: selectedUserId},
        {senderId: selectedUserId, receiverId: myId},
      ]
    })
    await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

    res.json({success: true, messages})
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})

  }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true })
    res.json({ success: true })
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // image can be a Cloudinary URL from frontend
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    // Create message document
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: image || "",
    });

    // Emit the new message to the receiver using Socket.io
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log("Send message error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};