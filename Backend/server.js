require("dotenv").config();

const app = require("./src/app.js");
const connectToDb = require("./src/config/database.js");

async function startServer() {
    try {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        }) 
        await connectToDb();
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

startServer();