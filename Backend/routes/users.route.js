const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {userModel}=require("../models/users.models")
const{client}=require("../config/redisdb")
const userRouter=express.Router()
const{authenticator}=require("../middlewares/authentication.middleware")
const{authorize}=require("../middlewares/authorization.middleware")

//Register Route
userRouter.post("/register",async(req,res)=>{
    let inputData=req.body
    if(!inputData.email || !inputData.mobile || !inputData.name || !inputData.password){
        res.status(400).send({"message":"Please Fill Complete Information"})
    }else{
        try {
            let ipEmail=inputData.email
            let findData=await userModel.find({
                $or: [
                  { email: { $regex: ipEmail, $options: 'i' } }, // Case-insensitive email search
                  { mobile: { $regex: inputData.mobile, $options: 'i' } } // Case-insensitive mobile search
                ]
              })
              
            if(findData.length==1){
                res.status(400).send({"message":"User Already Exist. Please Try Another Email Or Mobile Number."})
            }else{
                let ipPassword=inputData.password
                let createdDate=new Date().toLocaleDateString()
                bcrypt.hash(ipPassword, 5, async(err, hash)=>{
                    if(err){
                        res.status(400).send({"message":"Sorry :( , Server Error"})
                    }else if(hash){
                        let newUser=new userModel({
                            name:inputData.name,
                            email:inputData.email,
                            mobile:inputData.mobile,
                            groups:[],
                            createdDate:createdDate,
                            friends:[],
                            private:inputData.private||false,
                            password:hash,
                            profileLink:inputData.profileLink||"NA",
                            role:inputData.role||"user",
                            dob:inputData.dob || "NA"
                        })
                        await newUser.save()
                        res.status(201).send({'message':"User Register Successfully!"})
                    }else{
                        res.status(400).send({"message":"Sorry :( , Server Error"})                       
                    }
                });

            } 
        } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
        }
    }
})

userRouter.post("/login",async(req,res)=>{
    let ipData=req.body
    if(!ipData.email || !ipData.password){
        res.status(400).send({"message":"Please Fill All Information."})
    }else{
        try {
            let ipEmail=ipData.email
        let findData=await userModel.find({email:ipEmail})
          if(findData.length==1){
            bcrypt.compare(ipData.password, findData[0].password, async function(err, result){
                if(err){
                    res.status(400).send({"message":"Please Fill Correct Information."})
                }else if(result){
                    var token = jwt.sign({ userID: findData[0]._id, userRole:findData[0].role, userName:findData[0].name,userEmail:findData[0].email }, process.env.seckey);
                    await client.SET(ipData.email,token)
                    res.status(201).send({'message':"User Login Successfully!",'ChatAppToken':token,userEmail:findData[0].email})
                }else{
                    res.status(400).send({"message":"Please Fill Correct Information."})
                }
            })
          }else{
            res.status(400).send({"message":"Please Enter Valid Information"})
          }
        } catch (error) {
            console.log(error.message)
            res.status(400).send({"message":"Sorry :( , Server Error"})
        }
    }
})

userRouter.use(authenticator)

userRouter.patch("/password/update",async(req,res)=>{
    let userID=req.body.userID
    
    try {
        let findEmail=await userModel.findById({_id:userID})
        let oldPass=req.body.oldPassword
        let newPass=req.body.newPassword
        let passFromDB=findEmail.password
        let matchPass=await bcrypt.compare(oldPass, passFromDB)
        if(matchPass){
            bcrypt.hash(newPass, 5, async(err, hash)=>{
                if(err){
                    res.status(400).send({"message":"Sorry :( , Server Error"})
                }else if(hash){
                     await userModel.findByIdAndUpdate({_id:userID},{password:hash})
                     res.status(201).send({'message':"Password Update Successfully!"})
                }else{
                    res.status(400).send({"message":"Sorry :( , Server Error"})                       
                }
            })
        }else{
            res.status(400).send({"message":"Please Enter Correct Password"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

userRouter.delete("/logout",async(req,res)=>{
    let email=req.body.userEmail
   try {
    let tokenFromRedis  = await client.DEL("token",email)
    if(tokenFromRedis){
        res.status(201).send({"message":"User Logged Out Successfully!"})
    }else{
        res.status(401).send({"message":"Not Logged Out!"})
    }
   } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
   }
})

userRouter.get("/all",authorize,async(req,res)=>{
    try {
        let Data=await userModel.find()
        res.status(200).send({"message":"All Users Data Retrieved!","allUsers":Data})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

userRouter.patch("/update/profilepic",async(req,res)=>{
    try {
        let userID=req.body.userID
        let profileLink=req.body.profileLink
        await userModel.findByIdAndUpdate({_id:userID},{profileLink})
        res.status(201).send({"message":"Profile Pic Updated Successfully!",profileLink})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

userRouter.patch("/update/private/status",async(req,res)=>{
    try {
        let userID=req.body.userID
        let private=req.body.status
        await userModel.findByIdAndUpdate({_id:userID},{private})
        res.status(201).send({"message":"Status Updated Successfully!"})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

userRouter.patch("/update/dob",async(req,res)=>{
    try {
        let userID=req.body.userID
        let dob=req.body.dob
        await userModel.findByIdAndUpdate({_id:userID},{dob})
        res.status(201).send({"message":"Date Of Birth Updated Successfully!"})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

userRouter.get("/profile/link",async(req,res)=>{
    let userID=req.body.userID
    try {
        let userData=await userModel.findById({_id:userID})
        res.status(201).send({"message":"Here is the profile link!",profile:userData.profileLink})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message":"Sorry :( , Server Error"})
    }
})

// userRouter.get("/all/friends",async(req,res)=>{
//     try {
//         let userID=req.body.userID
//         let findFriends=await userModel.findById({_id:userID})
//         let allFriends=findFriends.friends
//         if(allFriends.length==0){
//             res.status(200).send({'message':"You Don't Have Any Friends!",friends:false})
//         }else{
//             res.status(200).send({'message':'All Friends Retrieved Successfully!',friends:allFriends})
//         } 
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).send({"message":"Sorry :( , Server Error"})
//     }
// })



module.exports={
    userRouter
}




