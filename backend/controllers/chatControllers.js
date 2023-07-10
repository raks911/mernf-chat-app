const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModels");
const User = require("../models/userModels");

const accessChat = asyncHandler(async(req,res) => {
    const {userId} = req.body;
    if(!userId){
        console.log("UserID param not sent with request");
        return res.sendStatus(400);
    }
    var isChat= await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq: req.user._id}}},
            {users :{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select:"name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };

        try{
            const newchat=await Chat.create(chatData);
            const FullChat= await Chat.findOne({_id:newchat._id}).populate("users","-password");
            res.status(200).send(FullChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message); 
        }
    }
});


const fetchchats= asyncHandler(async (req,res) => {
    try{
        const userId=req.user._id;
        await Chat.find({users:{$elemMatch :{$eq:userId}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async(results) => {
            results=await User.populate(results,{path:"latestMessage.sender",select:"name pic email"});
            res.status(200).send(results);
        });
    }
    catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

const creategroupchat =asyncHandler(async (req,res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please Fill all the fields"});
    }

    var users = JSON.parse(req.body.users);;
    if(users.length<2){
        return res.status(400).send({message:"select more users"});
    }

    users.push(req.user);
    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });
        const fullGroupChat= await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

const renamechat=asyncHandler(async(req,res) => {
    const {chatId,chatName} = req.body;
    const renamed=await Chat.findByIdAndUpdate(chatId,{chatName,},{
        new:true,
    }).populate("users","-password").populate("groupAdmin","-password");
     
    if(!renamed){
        res.status(400);
        throw new Error("chat not found");
    }
    else{
        res.json(renamed);
    }
});

const addtogroup=asyncHandler(async(req,res) => {
    const {chatId,userId}=req.body;
    const adminId=req.user._id;
    // const check=await Chat.findById({_id:chatId}).populate("groupAdmin");
    // const checkid=check.groupAdmin._id;
    // if(adminId===checkid){
        const added=await Chat.findByIdAndUpdate(chatId,{
            $push:{
                users:userId,
            }},{
                new:true
            }).populate("users","-password").populate("groupAdmin","-password");
            if(!added){
                res.status(400);
                throw new Error("chat not found");
            }
            else{
                res.json(added);
        }
});


const removefromgroup=asyncHandler(async(req,res) => {
    const {chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{
            users:userId,
        }},{
            new:true
        }).populate("users","-password").populate("groupAdmin","-password");
        if(!removed){
            res.status(400);
            throw new Error("chat not found");
        }
        else{
            res.json(removed);
        }
});

module.exports={accessChat,fetchchats,creategroupchat,renamechat,addtogroup,removefromgroup};