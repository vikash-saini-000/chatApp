import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { v2 as cloudinary } from 'cloudinary';



//signup a new user or adding new user in mongodb database
export const signup = async (req, res) => {
    const { fullName, email, password ,bio} = req.body;
    try {
        if(!fullName || !email || !password || !bio) {
            return res.json({ message: "missing details" ,success:false});
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists",success:false });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName:fullName,
            email:email,
            password: hashedPassword,
            bio:bio
        });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.json({ message: "Account created successfully", token,success:true ,userData:newUser});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server error ${error}`,success:false });
        
    }
}


//login  a user 
export const login=async(req,res)=>{
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ message: "User does not exist",success:false });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ message: "Invalid credentials",success:false });
        }
        const token = generateToken(userData._id);
        res.json({ message: "Login successful", token,success:true ,userData});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server error ${error}`,success:false });
        
    }
}

//check user is authenticated or not
export const checkAuth=async(req,res)=>{
    res.json({ success: true, user: req.user });
}



export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, ...(profilePic && { profilePic }) },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};