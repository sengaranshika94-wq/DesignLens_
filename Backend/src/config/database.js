const mongoose = require("mongoose")
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
async function connectToDb(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to Db");
    })
}

module.exports = connectToDb