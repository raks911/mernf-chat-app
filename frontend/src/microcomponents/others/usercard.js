import React from 'react'
import "./usercard.css"
const usercard = ({user, handleFunction }) => {
  return (
    <div onClick={handleFunction} className='total-container'>
    <div className='sidebar-img-container'>
        <img src={user.pic}></img>
    </div>
    <div className='sidebar-info-container'>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
    </div>
    </div>
  )
}

export default usercard;