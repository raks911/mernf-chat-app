import React, { useState,useRef} from 'react';
import "./auth.css"
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [open, setOpen] = React.useState(false);
  const [toast,setToast] = useState();
  const baseURL="https://mern-chat-ap-rv61.vercel.app"
  const navigate = useNavigate();
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
  const submitHandler = async () => {
    if(!email || !password){
      setToast("Please fill all the fields")
      setOpen(true); 
      return ;
    }
    try{
      const config ={
        headers: {
          "Content-Type":"application/json",
        },
      };
      const {data} =await axios.post(`${baseURL}/user/login`,{email,password},config);
      localStorage.setItem('userInfo',JSON.stringify(data));
      console.log(data);
      navigate("/chat");
    } catch(error){
      setToast("Invalid id or password");
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
    <div className='forl-container'>
      <form className='forl'>
              <label>Email:</label>
              <input placeholder='Email'type="email" onChange ={(e) => setEmail(e.target.value)}></input>
        </form>
        <form className='forl'>
              <label>Password:</label>
              <input placeholder='Password' type="password" onChange={(e) => setPassword(e.target.value)}></input>
        </form>
      <button className="butt" onClick={submitHandler} style={{"top":"1.5rem","marginBottom":"1.5rem"}}>Submit</button>
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

export default Login