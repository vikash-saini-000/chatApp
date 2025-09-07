
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cloudinary from './lib/cloudinaryConfig.js';


import cors from 'cors';
import http from 'http';

import { connectDB } from './lib/db.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import { Server } from "socket.io" ;


// create express app and http server
const app = express();
const server = http.createServer(app);
let PORT=process.env.PORT || 5000;;

server.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
});

//initialize socket io server
export const io = new Server(server,{
    cors:{
        origin:"*",
        
    }
});

//store online users
export const userSocketMap={};    //{userId:socketId}

//socket io connection handler
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("New user connected with id:",userId);
    if(userId){
        userSocketMap[userId]=socket.id;
    };
    //emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("user disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
        

    })
    
});


//middelware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true ,limit: '10mb'}));

//connect to mongodb
await connectDB();

//auth routes
app.use('/api/auth', userRouter);
//message routes
app.use('/api/messages', messageRouter);




