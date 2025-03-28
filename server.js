//importing all external requires modules after installion
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')



//middleware
const PORT=3000
const app=express()
app.use(express.json())




//Connecting mongodb atlas   http://localhost:3000/
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully...")
).catch(
    (err)=>console.log(err)
)




// Api landing page
app.get('/',async(req,res)=>{
    try{
          res.send("<h1>welcome to the backend and week 2</h1>")
    }
    catch(err)
    {
        console.log(err)
    }
})



//API Registration page 
app.post('/register',async(req,res)=>{
    const {user,email,password}=req.body
    try{
        const hashpassword=await bcrypt.hash(password,20)
        const newUser=new User ({user,email,password:hashpassword})
        await newUser.save()
        console.log("New user is registered succcesfully...")
        res.json({message:'User created....'})
    }
    catch(err)
    {
        console.log(err)
    }
})


// API Login Page
app.post('',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.password)))
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }
        res.json ({message:"Login Successful", username: user.username});
    }
    catch(err)
    {
        console.log(err)
    }
})



// Server Running and Testing
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Server is running on port: "+PORT)
})