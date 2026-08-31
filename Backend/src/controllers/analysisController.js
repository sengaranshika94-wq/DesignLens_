const designModel = require("../models/designModel")
const { analyzeDesign } = require("../services/ai.service")
const analysisModel = require("../models/analysisModel")
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

module.exports = {
    analyzeDesignController
}