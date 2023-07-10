import React from 'react'
import './scrollchat.css'
import Avatar from '@mui/material/Avatar';
import { ChatState } from '../../Context/Chatprovider';

const ScrollChat = ({messages}) => {
    const {user}=ChatState();
    const isSameSender = (mes,i) => {
        return (i<messages.length-1 && (messages[i+1].sender._id !== mes.sender._id  || messages[i+1].sender._id===undefined) && messages[i].sender._id!==user._id);
    }

    const isLastmessage = (mes,i) => {
        return (i===messages.length-1 && messages[messages.length-1].sender._id && messages[messages.length-1].sender._id!==user._id )
    }
  return (
    <div >{messages && messages.map((mes,i) => (
        <div key={mes._id}>{
            (mes.sender._id !== user._id)?(<span style={{"display":"flex","width":"25%","margin-left":"40px","margin-bottom":"10px","justifyContent":"left","alignItems":"flex-end"}}>
                <div className='messages'  style={{
                    backgroundColor : "#7754b2"
                }}>{mes.content}</div>
            </span>):(<span style={{"display":"flex","margin-bottom":"10px","justifyContent":"right","alignItems":"flex-start","margin-right":"20px"}}>
                <div className='messagesbyyou' style={{
                    backgroundColor : "#d04ed6"
                }}>{mes.content}</div></span>)}
               { (isSameSender(mes,i) || isLastmessage(mes,i)) && (
                    <Avatar src={mes.sender.pic}></Avatar>
                )
}</div>
    ))}</div>
  )
}

export default ScrollChat;