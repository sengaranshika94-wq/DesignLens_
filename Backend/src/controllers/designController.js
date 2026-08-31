const designModel = require('../models/designModel')

async function createDesign(req,res){
    const {title}=req.body
    const design = await designModel.create({
        user:req.user.id,
        title:title
    })
    return res.status(201).json({
        message:"Design created successfully",
        design
    })
}
module.exports = {createDesign}