const express = require("express")
const cors = require("cors")
const app = express()
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const designRouter = require("./routes/design.routes")
const analysisRouter = require("./routes/analysis.routes")

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/designs',designRouter)
app.use('/api/analysis',analysisRouter)

module.exports = app