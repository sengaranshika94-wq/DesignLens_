const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"a username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"an email is required"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    }
},
{timestamps:true}
)
const userModel = mongoose.model("users",userSchema)

module.exports = userModel