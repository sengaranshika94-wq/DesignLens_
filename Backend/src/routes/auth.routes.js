const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/authController")
const authMiddleware = require('../middlewares/authMiddleware')
authRouter.post("/register",authController.registerController)
authRouter.post("/login",authController.loginController)
authRouter.get("/logout",authController.logoutController)
authRouter.get("/getUser",authMiddleware,authController.getUserController)
module.exports = authRouter