const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redis = require('../config/cache')
const crypto = require('crypto');
async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: "user already exist"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        return res.status(201).json({
            message: "user registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "failed to register user"
        });
    }
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
    },process.env.JWT_SECRET,{
        expiresIn:'3d',
        jwtid: crypto.randomUUID(),
    })

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
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
    secure: true,
    sameSite: "none"
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
async function updateProfileController(req, res) {
    try {
        const { username, email } = req.body;

        const cleanUsername = username?.trim();
        const cleanEmail = email?.trim();

        if (!cleanUsername || !cleanEmail) {
            return res.status(400).json({
                message: "username and email are required"
            });
        }

        // Check whether another user already has this username or email
        const existingUser = await userModel.findOne({
            $or: [
                { username: cleanUsername },
                { email: cleanEmail }
            ],
            _id: { $ne: req.user.id }
        });

        if (existingUser) {
            if (existingUser.username === cleanUsername) {
                return res.status(409).json({
                    message: "username already exists"
                });
            }

            if (existingUser.email === cleanEmail) {
                return res.status(409).json({
                    message: "email already exists"
                });
            }

            return res.status(409).json({
                message: "username or email already exists"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                username: cleanUsername,
                email: cleanEmail
            },
            {
                new: true,
                runValidators: true
            }
        ).select("_id username email");

        if (!updatedUser) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        return res.status(200).json({
            message: "profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);

        return res.status(500).json({
            message: "failed to update profile"
        });
    }
}
module.exports = {
    registerController,
    loginController,
    logoutController,
    getUserController,
    updateProfileController
}