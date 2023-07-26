const jwt=require("jsonwebtoken")
require('dotenv').config()
const {client} = require("../config/redisdb")
const {userModel}=require("../models/users.models")


const authorize=async (req, res, next)=>{
        try {
            let email=req.headers.authorization?.split(" ")[1]
            let findEmail=await userModel.findOne({email})
            if(!findEmail){
                res.status(401).send({'message': 'This Route Is Not authorized For Your Designation'});
            }else if(findEmail.role=='admin'){
                next()
            }else{
                res.status(401).send({'message': 'This Route Is Not authorized For Your Designation'});
            }
        } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
        }
}

module.exports={
    authorize
}