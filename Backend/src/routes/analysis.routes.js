const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const analysisController = require("../controllers/analysisController")

router.post(
    "/:designId",
    authMiddleware,
    analysisController.analyzeDesignController
)

module.exports = router