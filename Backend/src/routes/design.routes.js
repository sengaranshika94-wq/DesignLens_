const express = require("express")
const designRouter = express.Router()
const authMiddleware= require("../middlewares/authMiddleware")
const designController = require("../controllers/designController")
const upload = require('../middlewares/uploadMiddleware')
//upload.single("screenshot"):I'm expecting one file, and the field name of that file must be screenshot.
designRouter.post('/',authMiddleware,upload.single("screenshot"),designController.createDesign)

module.exports = designRouter