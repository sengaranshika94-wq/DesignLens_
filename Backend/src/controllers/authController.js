const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000
    };
}


async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "username, email and password are required"
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        const isUserExist = await userModel.findOne({
            $or: [
                { email: cleanEmail },
                { username: cleanUsername }
            ]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: "user already exist"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username: cleanUsername,
            email: cleanEmail,
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


async function loginController(req, res) {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "identifier and password are required"
            });
        }

        const user = await userModel.findOne({
            $or: [
                { email: identifier.trim().toLowerCase() },
                { username: identifier.trim() }
            ]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "unauthorized access"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                message: "server authentication configuration error"
            });
        }

        const token = jwt.sign(
            {
                id: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3d",
                jwtid: crypto.randomUUID()
            }
        );

        res.cookie(
            "token",
            token,
            getCookieOptions()
        );

        return res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "failed to login"
        });
    }
}


async function logoutController(req, res) {
    try {
        res.clearCookie(
            "token",
            getCookieOptions()
        );

        return res.status(200).json({
            message: "user logged out successfully"
        });

    } catch (error) {
        console.error("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: "failed to logout"
        });
    }
}


async function getUserController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        return res.status(200).json({
            message: "user fetched successfully",
            user
        });

    } catch (error) {
        console.error("GET USER ERROR:", error);

        return res.status(500).json({
            message: "failed to fetch user"
        });
    }
}


async function updateProfileController(req, res) {
    try {
        const { username, email } = req.body;

        const cleanUsername = username?.trim();
        const cleanEmail = email?.trim().toLowerCase();

        if (!cleanUsername || !cleanEmail) {
            return res.status(400).json({
                message: "username and email are required"
            });
        }

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
};