import React, { useEffect } from 'react'
import "./mychats.css";
import {useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Usercard from './usercard'
import { ChatState } from '../../Context/Chatprovider';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Modalcard from './modalcard';
import Box from '@mui/material/Box'
import { Button } from '@mui/base';

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
const MyChats = ({fetchAgain}) => {
  const {user,selectedChat,setSelectedChat,chats,setChats}=ChatState();
  const [loggedUser,setloggedUser] = useState();
  const [selectedUsers,setSelecetedUsers]  = useState([]);
  const [groupChatName,setGroupChatName]=useState("");
  const [search,setSearch] = useState("");
  const [result,setResult] = useState("");

  const [modalresult,setModalresult]=useState();
  const [modalSearch,setMSearch] = useState();
  const fetchchats=async() => {
    try{
      const config ={
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data}=await axios.get(`${baseURL}/chat`,config);
      setChats(data);
    }
    catch(error){

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
      console.log(data);
    }
    catch(err){
    }
  }

  const removefromselect = async (res) =>{
    const data = await selectedUsers.filter((su) => (su._id!==res._id)) ;
    setSelecetedUsers(data);
  }

  const handleGroup = async (res) => {
    if(!selectedUsers.includes(res)){
    try{
      await setSelecetedUsers([...selectedUsers,res]);
    } 
    catch(error){

    }
  }}

  
  const handleSearched = async () => {
  try{
    const config = {
      headers:{
        Authorization:`Bearer ${user.token}`,
      },
    };
    const {data} = await axios.get(`${baseURL}/user?search=${search}`,config);
    setResult(data);
  }
  catch(err){
  }
}

const handlemodalSubmit = async() => {
  if(!groupChatName || !selectedUsers){
    return ;
  }
  try{
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`,
      }
    };

    const {data} = await axios.post(`${baseURL}/chat/group`,{
      name:groupChatName,
      users:JSON.stringify(selectedUsers.map((su) => su._id)),
    },config);
    setChats([data,...chats]);
    handleClose();
  }
  catch(error){

  }
}

const [open, setOpen] = React.useState(false);
  const handleOpen = (() => {
    setMSearch("");
    setModalresult([]);
    setSelecetedUsers([]);    
    setOpen(true)});
  const handleClose = () => setOpen(false);

const accessChat=async (userId) => {
  try{
    const config = {
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`,
      }
    }

    const {data}=await axios.post(`${baseURL}/chat`,{userId},config);

    if(!chats.filter((c) => c.id === data._id)){
      setChats([data,...chats]);
    }
    setSelectedChat(data);
    console.log(data);
  }
  catch(err){

  }
}


  const toggleDrawer =() => {
    const sidebar=document.querySelector('.sidebar');
    sidebar.style.left=0+'px';
  }
  const closedrawer = () => {
    const sidebar=document.querySelector('.sidebar');
    sidebar.style.left=-400+'px';
  }

  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
    console.log(chats);
  },[fetchAgain]);
  return (
    <>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Create group chat
          </Typography>
          <form>
            <input className='add-name' placeholder="Chat Name" onChange={(e) => setGroupChatName(e.target.value)}></input>
          </form>
          <form>
          <input className='add-Users' placeholder="Add Users" onChange={(e) => handlemodalSearch(e.target.value)}></input>
          </form>
          <span className='selected'>
            {selectedUsers?.map( (su) => (
              <div>
                <h3>{su.name}</h3>
                <CloseIcon fontSize='small' onClick={()=>removefromselect(su)} ></CloseIcon>
                </div>
            )) }
          </span>
          <div>{modalresult?.slice(0,4).map((res) => (
            <Modalcard key={res._id} user={res} handleFunction={() => handleGroup(res)}>
            </Modalcard>
          ))}</div>
          <Button onClick={() => handlemodalSubmit()}style={{"border":"4px solid var(--back)" ,"margin-top":"20px" ,"padding":"8px 15px","letterSpacing":"1px","fontWeight":"600"}}>Create Chat</Button>
        </Box>
      </Modal>
    <div className="sidebar"> 
    <div className='upper-sidebar'>
    <form>
    <input placeholder='Username' onChange={(e) => setSearch(e.target.value)}></input>
    </form>
    <SearchIcon  onClick={handleSearched} fontSize="large"></SearchIcon>
    <CloseIcon onClick={closedrawer} fontSize="large" ></CloseIcon>
    </div>
    <div>{result?result.map(res => (
      <Usercard
      key={res._id} user={res} handleFunction={() => accessChat(res._id)}
      />
    )):<div></div>}</div>
    </div>
    <div className="mychats-container">
      <div class="chat-btn-container">
        <button class="chat-btn" onClick={toggleDrawer}> <SearchIcon/> <p>Search users</p></button>
        <button class="chat-btn" onClick={handleOpen}> <AddIcon fontSize='medium'></AddIcon> <p>New Group</p> </button>
      </div>
      <div className='middle-container'>
        <p>Messages</p>
        <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
      </div>
      <div>
      {chats?.map( (chat) => (
        (selectedChat && chat._id===selectedChat._id)?
        <div className='choosen' onClick={()=>setSelectedChat(chat)}>
        {(chat.isGroupChat)?<div>{chat.chatName}</div>:
        (chat.users[0]._id===user._id)?<div>{chat.users[1].name}</div>:<div>{chat.users[0].name}</div>}
      </div>
          :
          <div className='chat-cards' onClick={()=>setSelectedChat(chat)}>
            {(chat.isGroupChat)?<div>{chat.chatName}</div>:
            (chat.users[0]._id===user._id)?<div>{chat.users[1].name}</div>:<div>{chat.users[0].name}</div>}
          </div>
        ))}
      </div>
      </div>
      <div>
    </div>
    </>
  )
}
export default MyChats;