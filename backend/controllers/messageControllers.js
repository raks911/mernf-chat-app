const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModels');
const Message = require('../models/messageModels');
const User = require('../models/userModels');
const sendMessage = asyncHandler(async(req,res) => {
    const { content, chatId} =req.body;
    if(!content || !chatId){
        return res.sendStatus(400).send("invalid");
    }
    var newMessage={
        sender: req.user._id, 
        content: content,
        chat: chatId,
    };
    try{
        var message= await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message =await User.populate(message,{
            path:'chat.users',
            select:'name pic email',
        });
        
        await Chat.findByIdAndUpdate(req.body._id,{
            latestMessage:message
        })
        res.json(message);
    }
    catch(err){
        res.status(400);
        throw new Error(err);
    }
})


const allMessages = asyncHandler(async (req,res) => {
    try{
        const messages= await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
        res.json(messages);
    }
    catch(err){
        res.status(400);
        throw new Error(err);
    }
})

module.exports = { sendMessage,allMessages} ;