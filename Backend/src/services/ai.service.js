const ai = require("../config/gemini");

async function analyzeDesign(imageBuffer, mimeType) {
    const imageBase64 = imageBuffer.toString("base64");

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        config: {
            responseMimeType: "application/json",

            responseSchema: {
                type: "object",

                properties: {
                    overallScore: {
                        type: "number"
                    },

                    summary: {
                        type: "string"
                    },

                    categoryScores: {
                        type: "object",

                        properties: {
                            visualDesign: { type: "number" },
                            ux: { type: "number" },
                            accessibility: { type: "number" },
                            typography: { type: "number" },
                            layout: { type: "number" },
                            consistency: { type: "number" }
                        },

                        required: [
                            "visualDesign",
                            "ux",
                            "accessibility",
                            "typography",
                            "layout",
                            "consistency"
                        ]
                    },

                    strengths: {
                        type: "array",

                        items: {
                            type: "object",

                            properties: {
                                category: {
                                    type: "string"
                                },

                                title: {
                                    type: "string"
                                },

                                description: {
                                    type: "string"
                                }
                            },

                            required: [
                                "category",
                                "title",
                                "description"
                            ]
                        }
                    },

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
                                },

                                position: {
                                    type: "object",

                                    properties: {
                                        x: {
                                            type: "number"
                                        },

                                        y: {
                                            type: "number"
                                        }
                                    },

                                    required: [
                                        "x",
                                        "y"
                                    ]
                                }
                            },

                            required: [
                                "category",
                                "severity",
                                "title",
                                "description",
                                "whyItMatters",
                                "recommendation",
                                "position"
                            ]
                        }
                    }
                },

                required: [
                    "overallScore",
                    "summary",
                    "categoryScores",
                    "strengths",
                    "issues"
                ]
            }
        },

        contents: [
            {
                inlineData: {
                    mimeType,
                    data: imageBase64
                }
            },

            {
                text: `
You are a professional UI/UX design reviewer performing a visual audit of a website screenshot.

Analyze ONLY what can be visually observed in the screenshot.

Evaluate these six dimensions:
- visualDesign
- ux
- accessibility
- typography
- layout
- consistency

Give each category a score from 0 to 100.

Calculate the overallScore as a reasonable weighted overall assessment of these six category scores.

Also provide:
1. A concise summary of the overall design quality.
2. A list of genuine strengths.
3. A list of the most important issues.

For every issue provide:
- category
- severity: "high", "medium", or "low"
- title
- description
- whyItMatters
- recommendation

IMPORTANT FOR ISSUE POSITIONS:

For every issue, identify the approximate visual location of the issue inside the screenshot.

Return the position as normalized percentages:
- x = horizontal position from the LEFT edge, from 0 to 100
- y = vertical position from the TOP edge, from 0 to 100

Examples:
- top-left area = x: 20, y: 20
- center = x: 50, y: 50
- bottom-right = x: 80, y: 80

The position must refer to the actual visible area where the issue occurs.

Do NOT invent exact coordinates when an issue cannot be localized visually.

For issues that affect a specific visible element, place the marker near that element.
For issues that apply to a broader area, place the marker near the center of the affected area.

Do NOT create strengths just to fill space.
Do NOT create issues that are not visually supported by the screenshot.
Do NOT infer hidden HTML, CSS, DOM structure, source code, or functionality that cannot be determined visually.

Return only the requested JSON structure.
`
            }
        ]
    });

    return JSON.parse(response.text);
}

module.exports = {
    analyzeDesign
};