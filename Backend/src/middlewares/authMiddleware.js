const redis = require("../config/cache")
const jwt = require("jsonwebtoken")

async function authUser(req,res,next){
    const token = req.cookies.token
    const isTokenBlackListed = await redis.get(token)
    if(!token|| isTokenBlackListed){
        return res.status(401).json({
            message:"invalid token"
        })
    }
    try{
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({
            message: "invalid token"
        })
    }
}
module.exports = authUser