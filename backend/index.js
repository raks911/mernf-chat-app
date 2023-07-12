const express=require("express");
const app=express();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageroutes = require('./routes/messageRoutes')
const {notfound,errorHandler} = require('./middleware/errhamiddleware');
const cors=require('cors');//handling CORS error
app.use(cors({
    origin:"*"
}))

const connectDB=require("./config/db");
connectDB();

const bodyParser=require('body-parser');
const jsonParser=bodyParser.json();
const {chats} = require("./data/data")


app.get('/',(req,res) => {
    res.send("hello");
})

//endpoints for user
app.use('/user',jsonParser,userRoutes);
app.use('/chat',jsonParser,chatRoutes);
app.use('/messages',jsonParser,messageroutes);

app.get('/chat/:id',(req,res) => {
    const id=req.params.id;
    const chat=chats.filter((chat) => chat._id===id);
    res.send(chat);
})

//error handling middlewares
app.use(notfound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server=app.listen(PORT,console.log("server started"));


const io =require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"*",
    },
});


io.on("connection",(socket) => {

    socket.on("setup",(userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on('join chat',(room) => {
        socket.join(room);
        console.log("user joined room:" + room);
    });

    socket.on("new message",(newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return;
        }
        
        chat.users.forEach( user=> {
            if(user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    })

    socket.off("setup",() => {
        console.log("discconnected");
        socket.leave(userData._id)
    })
})
