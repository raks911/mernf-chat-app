import React, { useState,useRef} from 'react'
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import "./auth.css"
const Signup = () => {
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [conpassword,setConpassword] = useState();
    const [pic,setPic] = useState();
    const [open, setOpen] = React.useState(false);
    const [toast,setToast] = useState();
    const baseURL="https://mernf-chat-app.vercel.app"
    const navigate = useNavigate();
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
    const inputRef=useRef(null);
    const handleimageclick= () => {
      inputRef.current.click()
    }

    useEffect(() => {
      picchange(pic);
    }, [pic])
    
    const picchange = async (e) => {
      if(pic===undefined){
        setToast("add proper image")
        setOpen(true); 
        return ;
      }
      if(pic.type ==="image/jpeg" || pic.type==="image/png"){
        const data=new FormData();
        data.append("file",pic);
        data.append("upload_preset","mern-chat-app");
        data.append("cloud_name","ddt6bqokv");
        await fetch("https://api.cloudinary.com/v1_1/ddt6bqokv/image/upload",{
          method:"post",
          body:data,
        }).then((res) => res.json()).then(data => {
          setPic(data.url.toString());
          setToast("please wait the image will appear")
          setOpen(true);
          console.log(data.url.toString());
        }).catch((error) => {
          console.log(error);
        })
      }
      
    }
    const submitHandler = async () => {
      if(!name || !email || !password || !conpassword || !pic){
        setToast("Please fill all the fields")
        setOpen(true); 
        return ;
      }
      if(password !==conpassword){
        setToast("Passwords do not match")
        setOpen(true);
        return;
      }
      try{
        const config ={
          headers: {
            "Content-Type":"application/json",
          },
        };
        const {data} =await axios.post(`${baseURL}/user`,{name,email,password,pic},config);
        localStorage.setItem('userInfo',JSON.stringify(data));
        navigate("/chat");
      } catch(error){
        setToast(error.message);
        setOpen(true);
      }
    }
    
    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="secondary"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );
  return (

    <div className='for-container'>
      <div className="imagecontainer" onClick={handleimageclick}>
          {pic ?<img src={pic} alt=""></img>:
          <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt=""></img>
          }
          <input type="file" ref={inputRef} style={{display :"none"}} onChange={(e) =>{setPic(e.target.files[0]);}}></input>
        </div>
        <form className='for'>
              <label>Username:</label>
              <input placeholder='Name' onChange={(e) => setName(e.target.value)}></input>
        </form>
        <form className='for'>
              <label>Email:</label>
              <input placeholder='Email'type="email" onChange ={(e) => setEmail(e.target.value)}></input>
        </form>
        <form className='for'>
              <label>Password:</label>
              <input placeholder='Password' type="password" onChange={(e) => setPassword(e.target.value)}></input>
        </form>
        <form className='for'>
              <label>Confirm Password:</label>
              <input placeholder='Enter your name' type="password" onChange={(e) => setConpassword(e.target.value)}></input>
        </form>
        <button className="butt" onClick={submitHandler} >Submit</button>
        <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={toast}
        action={action}
      />
    </div>
  )
}

export default Signup