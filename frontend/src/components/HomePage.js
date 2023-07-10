import React, { useState,useEffect} from 'react'
import "./Home.css";
import Signup from '../microcomponents/Authentication/Signup';
import Login from '../microcomponents/Authentication/Login';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(!userInfo){
            navigate("/chats");
        }
    },[navigate]);
    const [page,setPage] = useState(1);
  return (
    <div className='bc'>
    <div className='container'>
        
        <div>
            { (page === 1)?(<Signup></Signup>) : (<Login></Login>) }
        </div>
        <div className='buttoncontainer'>
            <div className='ss active' onClick={() => {
                document.querySelector('.ll').classList.remove('active');
                document.querySelector('.ss').classList.add('active');
                setPage(1);
            }}>Sign Up</div>
            <div className='ll'onClick={() => {
                document.querySelector('.ss').classList.remove('active');
                document.querySelector('.ll').classList.add('active');
                setPage(2);
            }}>Log In</div>
        </div>
    </div>
    </div>
  )
}

export default HomePage; 