const designModel = require("../models/designModel")
const { analyzeDesign } = require("../services/ai.service")
const analysisModel = require("../models/analysisModel")

// Analyzes a specific design using Gemini and saves the AI-generated analysis in MongoDB.
async function analyzeDesignController(req, res) {
    try {

        // Find the design requested by the user.
        // We also check the user ID so one user cannot analyze
        // another user's design.
        const design = await designModel.findOne({
            _id: req.params.designId,
            user: req.user.id
        })

        if (!design) {
            return res.status(404).json({
                message: "Design not found"
            })
        }

       

        // Tell the application that AI analysis has started
        design.status = "analyzing"
        await design.save()


        // Get the screenshot from the URL stored in MongoDB
        const response = await fetch(design.screenshotUrl)

        if (!response.ok) {
            throw new Error("Failed to download screenshot")
        }

        // Convert the downloaded image into a Buffer
        const arrayBuffer = await response.arrayBuffer()
        const imageBuffer = Buffer.from(arrayBuffer)

        // Get the image type, for example:
        // image/png or image/jpeg
        const mimeType = response.headers.get("content-type")

        // Send the image to Gemini
        // and receive our structured JSON response.
        const aiResponse = await analyzeDesign(
            imageBuffer,
            mimeType
        )

        // Save Gemini's result in MongoDB
        const analysis = await analysisModel.create({
            design: design._id,
            overallScore: aiResponse.overallScore,
            categoryScores: aiResponse.categoryScores,
            issues: aiResponse.issues
        })

        // Analysis completed successfully
        design.status = "completed"
        await design.save()

        return res.status(201).json({
            message: "Design analyzed successfully",
            analysis
        })

    } catch (err) {
        console.error("ANALYSIS ERROR:", err)

         // If the analysis fails, mark the design as failed
        if (req.params.designId) {
            await designModel.findByIdAndUpdate(
                req.params.designId,
                { status: "failed" }
            )
        }
        return res.status(500).json({
            message: "Failed to analyze design"
        })
    }
}

// Fetches one saved analysis by its ID and makes sure it belongs to the logged-in user.
async function getAnalysis(req, res) {
    try {

        const analysis = await analysisModel.findById(req.params.id)
            .populate("design") //Find this analysis and also fetch the Design document that this analysis belongs to 

        if (!analysis) {
            return res.status(404).json({
                message: "Analysis not found"
            })
        }

        // Make sure this analysis belongs to the logged-in user
        if (analysis.design.user.toString() !== req.user.id){ // Check whether that Design belongs to the currently logged-in user.
            return res.status(403).json({
                message: "Access denied"
            })
        }

        return res.status(200).json({
            message: "Analysis fetched successfully",
            analysis
        })

    } catch (err) {
        console.error("GET ANALYSIS ERROR:", err)

        return res.status(500).json({
            message: "Failed to fetch analysis"
        })
    }
}

// Fetches all analyses belonging to a specific design, with the newest analysis first
async function getDesignAnalyses(req, res) {
    try {

        const design = await designModel.findOne({
            _id: req.params.designId,
            user: req.user.id
        })

        if (!design) {
            return res.status(404).json({
                message: "Design not found"
            })
        }

       // Find all analyses that belong to this particular Design, and show the newest analysis first.
        const analyses = await analysisModel.find({
            design: design._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Analyses fetched successfully",
            analyses
        })

    } catch (err) {
        console.error("GET DESIGN ANALYSES ERROR:", err)

        return res.status(500).json({
            message: "Failed to fetch analyses"
        })
    }
}

module.exports = {
    analyzeDesignController,
    getAnalysis,
    getDesignAnalyses
}