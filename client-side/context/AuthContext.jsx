import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Set axios default header with token
  const setAxiosToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      if (!token) return;
      setAxiosToken(token);
      const { data } = await axios.get("/api/auth/check");
      if (data?.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) checkAuth();
  }, [token]);

  // Connect to socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // Login
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAxiosToken(data.token);
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    setAxiosToken(null);
    socket?.disconnect();
    toast.success("Logged out successfully");
  };
const updateProfile = async (body) => {
  try {
    setAxiosToken(token);

    // If profilePic is a File, upload to Cloudinary first
    if (body.profilePic instanceof File) {
      const formData = new FormData();
      formData.append("file", body.profilePic);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // from Cloudinary settings

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dtg8lxnyl/image/upload",
        formData
      );
      body.profilePic = cloudRes.data.secure_url; // replace File with URL
    }

    const { data } = await axios.put("/api/auth/update-profile", body);

    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    }
  } catch (error) {
    console.error("Update Profile Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Profile update failed");
  }
};

  return (
    <AuthContext.Provider
      value={{
        token,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        axios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
