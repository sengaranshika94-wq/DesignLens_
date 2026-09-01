const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const analysisController = require("../controllers/analysisController")

router.post(
    "/:designId",
    authMiddleware,
    analysisController.analyzeDesignController
)
router.get(
    "/history",
    authMiddleware,
    analysisController.getUserAnalyses
)
router.get("/:id",
    authMiddleware,
    analysisController.getAnalysis   
)
router.get("/design/:designId",
    authMiddleware,
    analysisController.getDesignAnalyses
)

module.exports = router