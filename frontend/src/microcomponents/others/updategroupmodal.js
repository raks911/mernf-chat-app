import React from 'react'
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Modalcard from './modalcard';
import { ChatState } from '../../Context/Chatprovider';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
const style = {
    position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor:'var(--secondary)',
  border: '3px solid #000',
  boxShadow: 1,
  p: 4,
  textAlign:'Center',
  };
  
  const baseURL="https://mernf-chat-app.vercel.app";
const Updategroupmodal = ({fetchAgain,setfetchAgain,fetchmessages}) => {
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {selectedChat,setSelectedChat,user}=ChatState();
  const [groupChatName,setGroupChatName]=useState("");
  const [modalSearch,setMSearch] = useState("");
  const [modalresult,setModalresult] = useState([]);

  const handleRename = async () => {
    if(!groupChatName)return;
    try{
        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`
            },
        }

        const {data} = await axios.put(`${baseURL}/chat/rename`,{
            chatId:selectedChat._id,
            chatName:groupChatName,
        },config);
        setSelectedChat(data);
        setfetchAgain(!fetchAgain);
    }catch(error){
        
    }
  }

  const handlemodalSearch=async (query) => {
    setMSearch(query);
    if(!query){
      return;
    }
    try{
      const config ={
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }

      const {data}=await axios.get(`${baseURL}/user?search=${modalSearch}`,config);
      setModalresult(data);
    }
    catch(err){
    }
  }

  const handleAddUser =async (res) =>{
    var count=selectedChat.users.length;
    for(var i=0;i<count;i++){
        if(selectedChat.users[i]._id === res._id){
            return;
        }
    }
    console.log(res._id);
    if(selectedChat.groupAdmin._id !==user._id){
        return;
    }
    try{
        const config ={
              headers:{
                Authorization:`Bearer ${user.token}`,
            }
        }
        const {data}=await axios.put(`${baseURL}/chat/groupadd`,
        {
            chatId:selectedChat._id,
            userId:res._id
        },config);
        setSelectedChat(data);
        setfetchAgain(!fetchAgain);
    }
    catch(err){

    }
  }

  const handleremove = async (res) => {
    if(selectedChat.groupAdmin._id !==user._id){
        return;
    }
    if(selectedChat.groupAdmin._id===res._id){
        return;
    }
    try{
        const config ={
              headers:{
                Authorization:`Bearer ${user.token}`,
            }
        }
        const {data}=await axios.put(`${baseURL}/chat/groupremove`,
        {
            chatId:selectedChat._id,
            userId:res._id
        },config);
        setSelectedChat(data);
        setfetchAgain(!fetchAgain);
        fetchmessages();
    }
    catch(err){
    }
  }
  return (
    <div >
        <GroupIcon fontSize="large" style={{"margin-right":"50px"}}onClick={handleOpen}></GroupIcon>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
           {selectedChat.chatName}
          </Typography>
          <form style={{"display":"flex","justify-content":"center","align-items":"center"}}>
            <input className='add-name' placeholder="New Chat Name" onChange={(e) => setGroupChatName(e.target.value)}></input>
            <button style={{"margin-top":"20px","background":"var(--back)","padding":"6px 10px","color":"var(--tertiary)","border-radius":"6px"}} onClick={() => (handleRename())}>Update</button>
           </form>
           <form>
          <input className='add-Users' placeholder="Add Users" onChange={(e) => handlemodalSearch(e.target.value)}></input>
          </form>
          <span className='selected'>
            {selectedChat.users?.map( (su) => (
              <div>
                <h3>{su.name}</h3>
                <CloseIcon fontSize='small' onClick={()=>handleremove(su)} ></CloseIcon>
                </div>
            ))}
          </span>
          <div>{modalresult?.slice(0,4).map((res) => (
            <Modalcard key={res._id} user={res} handleFunction={() => handleAddUser(res)}>
            </Modalcard>
          ))}</div>
        </Box>
      </Modal>
    </div>
  )
}

export default Updategroupmodal