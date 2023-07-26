const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    mobile:String,
    groups:[],
    createdDate:String,
    friends:[],
    private:Boolean,
    password:String,
    profileLink:String,
    role:String,
    dob:String
})

const userModel=mongoose.model("Users",userSchema)

module.exports={
    userModel
}