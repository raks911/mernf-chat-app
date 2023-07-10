import React from 'react'
import "./modalcard.css"
const Modelcard = ({user, handleFunction }) => {
  return (
    <div onClick={handleFunction} className='totalmodal-container'>
    <div className='modal-img-container'>
        <img src={user.pic}></img>
    </div>
    <div className='modal-info-container'>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
    </div>
    </div>
  )
}

export default Modelcard;