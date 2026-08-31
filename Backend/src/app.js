const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const designRouter = require("./routes/design.routes")
const analysisRouter = require("./routes/analysis.routes")
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/designs',designRouter)
app.use('/api/analysis',analysisRouter)

module.exports = app