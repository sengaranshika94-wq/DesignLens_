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

async function getDesigns(req,res){
    try{
        const designs = await designModel.find({
        user:req.user.id
    })
    return res.status(200).json({
        message:"Designs fetched successfully",
        designs
    })
    }catch(err){
        console.log("GET DESIGNS ERROR",err);
        return res.status(500).json({
            message:"Failed to fetch designs"
        })
    }
}

async function getDesign(req,res){

    const id= req.params.id
    const design = await designModel.findOne({
        _id:id,             //checks requested design id
        user:req.user.id    //checks logged-in user id
    })

     if (!design) {
        return res.status(404).json({
            message: "Design not found"
        })
    }

    return res.status(200).json({
        message:"Design fetched successfully",
        design
    })
}

async function deleteDesign(req,res){
    const id = req.params.id
    const result= await designModel.deleteOne({ 
        _id:id,
        user:req.user.id
    })
    if (result.deletedCount === 0) {
            return res.status(404).json({
            message: "Design not found"
        })
    }
    return res.status(200).json({
        message:"Design deleted successfully"
    })
}

module.exports = {createDesign,
    getDesigns,
    getDesign,
    deleteDesign
}