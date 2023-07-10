import React from 'react'
import { ChatState } from '../../Context/Chatprovider';
import SingleChat from './SingleChat';
import './ChatBox.css'
const ChatBox = ({fetchAgain,setfetchAgain}) => {
  const {selectedChat}=ChatState;
  return (
    <div className='ChatBox'>
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}></SingleChat>
    </div>
  )
}

export default ChatBox;