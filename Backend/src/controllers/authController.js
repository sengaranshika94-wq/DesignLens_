const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redis = require('../config/cache')
async function registerController(req,res){
    const {username,email,password}= req.body
    const isUserExist = await userModel.findOne({
        $or:[{email},{username}]
    })
    if(isUserExist){
        return res.status(409).json({
            message:"user already exist"
        })
    }
    const hash =await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        password:hash
    })
    const token=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:'3d'})
    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
    })
    return res.status(201).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email,

        }
    })


}

async function loginController(req,res){
    const {identifier, password} = req.body
    const user = await userModel.findOne({
        $or:[
            {email: identifier},
            {username: identifier}
        ]
    }).select("+password")
    if(!user){
        return res.status(401).json({
            message: "unauthorized access"
        })
    }
    const isMatch =await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({
            message: "invalid credentials"
        })
    }
    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:'3d'})

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
    })
    return res.status(200).json({
        message:"user logged in successfully ",
        user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
    })
}

async function logoutController(req,res){
    const token = req.cookies.token
    
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
    })
     if (token) {
        await redis.set(token, "blacklisted", "EX", 3600)
    }
    
    return res.status(200).json({
        message: "user logged out successfully"
    })
}

async function getUserController(req,res){
    const user = await userModel.findById(req.user.id)
    return res.status(200).json({
        message:"user fetched successfully",
        user
    })
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    getUserController
}