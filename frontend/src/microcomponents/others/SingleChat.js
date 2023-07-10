import React from 'react'
import { useState ,useEffect} from 'react';
import { ChatState } from '../../Context/Chatprovider'
import Updategroupmodal from './updategroupmodal';

import ScrollChat from './ScrollChat';
import './singlechat.css';
import axios from 'axios';

import io from 'socket.io-client';
const baseURL="https://mern-chat-ap-rv61.vercel.app";

var socket;
const SingleChat = ({fetchAgain,setfetchAgain}) => {
    const {user,selectedChat,setselectedChat} = ChatState();
    const [messages,setMessages] = useState([]);
    const [newMessage,setNewMessage]=useState();

    const [socketConnected,setSocketconnected]=useState(false);
    useEffect(() => {
        socket = io(baseURL);
        socket.emit("setup",user);
        socket.on("connection",() => {
            setSocketconnected(true);
        }) 
    },[]) 

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved",(newMessageRecieved) => {
            setMessages([...messages,newMessageRecieved]);
        })
    })

    const fetchMessages = async () => {
        if(!selectedChat) return ;
        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}=await axios.get(`${baseURL}/messages/${selectedChat._id}`,config);
            setMessages(data);
            socket.emit('join chat',selectedChat._id);
        }
        catch{
        }
    }
   
    
    const sendMessage = async (e) => {
        if(newMessage){
            try{
                 const config = {
                    headers:{
                        "Content-Type":"Application/json",
                        Authorization:`Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const {data} = await axios.post(`${baseURL}/messages`,{
                    content:newMessage,
                    chatId:selectedChat._id,
                },config);

                socket.emit("new message",data);
                setMessages([...messages,data]);
                console.log(messages);
            }
            catch(error){
            }
        }
    };

 
    
    const typinghandler = (e) => {
        setNewMessage(e.target.value);
    }
  return (
    <div style={{"width":"","background":"var(--primary)"}}>
        {(selectedChat)?(
            <>
        <div className='chat-header' >{(!selectedChat.isGroupChat)?<div>{
            (selectedChat.users[0]._id===user._id)?<div>{selectedChat.users[1].name}</div>:<div>{selectedChat.users[0].name}</div>
        }</div>:<div style={{"display":"flex","width":"100%","justifyContent":"space-between"}}>
                <h1>{selectedChat.chatName}</h1>
                <Updategroupmodal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchmessages={fetchMessages}></Updategroupmodal>
            </div>
        }</div>
        <div className='actual-chat-box'>
            <ScrollChat messages={messages}></ScrollChat>
        </div>
        <div style={{"display":"flex","justify-content":"center","align-items":"center"}}>
            <input className='message-box' placeholder="enter messages" onChange={typinghandler} value={newMessage}></input>
            <button style={{"background":"var(--secondary)","padding":"6px 10px","color":"var(--tertiary)","border-radius":"6px"}} onClick={()=>sendMessage()} type="button">Send</button>
        </div>
        </>
):     (
            <div className='actual-chat-box' style={{"textAlign":"center","justifyContent":"center","fontSize":"30px"}}>Start chatting!!</div>
        )
        }
    </div>
  )
}

export default SingleChat