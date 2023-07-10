import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import MyChats from '../microcomponents/others/myChats';
import ChatBox from '../microcomponents/others/ChatBox';
const Chatpage = ({}) => {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain] = useState(false);
  return (
    <div style={{"display":"flex","width":"100%"}}>
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setFetchAgain}/>}
      </div>
  )
}

export default Chatpage;