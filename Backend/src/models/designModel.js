const mongoose = require("mongoose")

const designSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    screenshotUrl:{
        type:String,
        default:""
    },
    status:{
        type: String,
        enum: ["pending", "analyzing", "completed", "failed"],
        default: "pending"
    }
},{timestamps:true})

const designModel = mongoose.model("designs",designSchema)

module.exports = designModel