const jwt=require('jsonwebtoken');

const generateToken = (_id) => {
    return jwt.sign({_id},"indiagate",{
        expiresIn:"30d",
    });
}

module.exports=generateToken;