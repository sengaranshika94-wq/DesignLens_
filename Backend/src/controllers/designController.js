const designModel = require('../models/designModel')
const imagekit = require('../config/imagekit')
async function createDesign(req, res) {
    try {
        console.log("1. Controller reached")
        console.log("2. File received:", req.file.originalname)

        console.log("3. Starting ImageKit upload")

        const uploadResponse = await imagekit.files.upload({
             file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname
        })

        console.log("4. ImageKit upload completed")

        const design = await designModel.create({
            user: req.user.id,
            title: req.body.title,
            screenshotUrl: uploadResponse.url
        })

        return res.status(201).json({
            message: "Design created successfully",
            design
        })

    } catch (err) {
        console.error("UPLOAD ERROR:", err)

        return res.status(500).json({
            message: "Failed to upload design"
        })
    }
}

module.exports = {createDesign}