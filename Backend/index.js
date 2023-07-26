const express=require("express")
const http=require("http")
const cors=require("cors")
require('dotenv').config()

const {connection}=require("./config/db")
const {userRouter}=require("./routes/users.route")


const app=express()
app.use(express.json())
app.use(cors())
app.use("/user",userRouter)

const server=http.createServer(app)


server.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected To The DB")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Port Is Listning On ${process.env.port}`)
})