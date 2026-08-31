// Import the Gemini client that we configured in config/gemini.js
const ai = require("../config/gemini")


// This function is responsible only for communicating with Gemini
// It receives the uploaded image and asks Gemini to analyze it
async function analyzeDesign(imageBuffer, mimeType) {

    // Multer gives us the uploaded image as a Buffer.
    // Gemini can receive the image data as Base64,
    // so we convert the Buffer into a Base64 string.
    const imageBase64 = imageBuffer.toString("base64")


    // Send the image + our instructions to Gemini
    const response = await ai.models.generateContent({

        // The Gemini model we are using for screenshot analysis
        model: "gemini-3.6-flash",

        // This tells Gemini that we want the final answer as JSON
        config: {
            responseMimeType: "application/json",

            // This describes the exact JSON structure we expect
            responseSchema: {
                type: "object",

                properties: {

                    // Overall DesignLens score
                    overallScore: {
                        type: "number"
                    },

                    // Scores for each design category
                    categoryScores: {
                        type: "object",
                        properties: {
                            visualDesign: {
                                type: "number"
                            },
                            ux: {
                                type: "number"
                            },
                            accessibility: {
                                type: "number"
                            },
                            typography: {
                                type: "number"
                            },
                            layout: {
                                type: "number"
                            },
                            consistency: {
                                type: "number"
                            }
                        },

                        // Require all category scores
                        required: [
                            "visualDesign",
                            "ux",
                            "accessibility",
                            "typography",
                            "layout",
                            "consistency"
                        ]
                    },

                    // List of problems found in the design
                    issues: {
                        type: "array",

                        items: {
                            type: "object",

                            properties: {

                                category: {
                                    type: "string"
                                },

                                severity: {
                                    type: "string"
                                },

                                title: {
                                    type: "string"
                                },

                                description: {
                                    type: "string"
                                },

                                whyItMatters: {
                                    type: "string"
                                },

                                recommendation: {
                                    type: "string"
                                }
                            },

                            required: [
                                "category",
                                "severity",
                                "title",
                                "description",
                                "whyItMatters",
                                "recommendation"
                            ]
                        }
                    }
                },

                // Require the main fields in every response
                required: [
                    "overallScore",
                    "categoryScores",
                    "issues"
                ]
            }
        },

        // "contents" contains everything we want to send to Gemini
        // In our case: the screenshot and our analysis instructions
        contents: [

            // First item: the uploaded screenshot
            {
                // inlineData tells Gemini that we are sending file data directly
                inlineData: {

                    // Tells Gemini what kind of image this is
                    // Example: "image/png" or "image/jpeg"
                    mimeType: mimeType,

                    // The actual image data converted to Base64
                    data: imageBase64
                }
            },

            // Second item: our instructions
            {
                text: `
                    You are a professional UI/UX design reviewer.

                    Analyze this website screenshot strictly based
                    on what can be visually observed.

                    Give scores from 0 to 100 for:
                    - visualDesign
                    - ux
                    - accessibility
                    - typography
                    - layout
                    - consistency

                    Calculate an overall score from these categories.

                    Identify the most important design issues.

                    For every issue provide:
                    - category
                    - severity
                    - title
                    - description
                    - whyItMatters
                    - recommendation

                    Do not invent information that cannot be determined
                    from the screenshot.

                    Return only the requested JSON structure.
                `
            }
        ]
    })


    // Gemini is returning JSON text.
    // JSON.parse converts that text into a JavaScript object
    // that our controller can later save into MongoDB.
    return JSON.parse(response.text)
}


// Export the function so that our controller can use it
module.exports = {
    analyzeDesign
}