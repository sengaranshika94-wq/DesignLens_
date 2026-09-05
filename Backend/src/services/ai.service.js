const ai = require("../config/gemini");

function getErrorStatus(error) {
    return (
        error?.status ||
        error?.response?.status ||
        error?.error?.code ||
        null
    );
}

function isTemporaryGeminiError(error) {
    const status = getErrorStatus(error);

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
    );
}

async function generateWithFallback(request) {
    const models = [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite"
    ];

    let lastError = null;

    for (const model of models) {
        try {
            console.log(`GEMINI: trying ${model}`);

            const response = await ai.models.generateContent({
                model,
                config: request.config,
                contents: request.contents,
            });

            console.log(`GEMINI: ${model} succeeded`);

            return response;

        } catch (error) {
            lastError = error;

            console.error(`GEMINI: ${model} failed`, {
                status: getErrorStatus(error),
                message: error?.message,
            });

            // If the error is not temporary,
            // don't try another model.
            if (!isTemporaryGeminiError(error)) {
                throw error;
            }

            // Small delay before trying the next model
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    // All fallback models failed.
    // Create our own safe error instead of exposing
    // Gemini's raw error to the frontend.
    const fallbackError = new Error(
        "AI analysis is temporarily unavailable."
    );

    fallbackError.status = 503;
    fallbackError.code = "AI_TEMPORARILY_UNAVAILABLE";

    // Keep original error for backend debugging only
    fallbackError.cause = lastError;

    throw fallbackError;
}

async function analyzeDesign(imageBuffer, mimeType) {
    const imageBase64 = imageBuffer.toString("base64");

    const request = {
        config: {
            temperature: 0.1,
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
            You are an expert UI/UX auditor analyzing a website screenshot.

            IMPORTANT:
            Analyze ONLY what is visibly present in the screenshot.
            Do not infer HTML, CSS, DOM structure, JavaScript, hidden functionality, or code.

            Evaluate these six dimensions:
            - visualDesign
            - ux
            - accessibility
            - typography
            - layout
            - consistency

            Give each category a score from 0 to 100.

            Calculate overallScore as a reasonable weighted assessment of the six category scores.

            Provide:
            1. A concise summary.
            2. Genuine strengths.
            3. Genuine, actionable issues.

            ISSUE RULES:

            Only report issues that are clearly visible in the screenshot.

            Prefer 4 to 8 high-value issues rather than many minor issues.

            Every issue must be UNIQUE.

            DO NOT report the same visual problem multiple times for different nearby elements unless the problems are genuinely different.

            For example, if several pieces of text have low contrast, report the most important/representative instance instead of creating many duplicate "low contrast" issues.

            For every issue provide:
            - category
            - severity: "high", "medium", or "low"
            - title
            - description
            - whyItMatters
            - recommendation
            - position

            POSITION RULES — VERY IMPORTANT:

            The position represents the exact visual location of the problem in the screenshot.

            Use normalized percentages.

            x:
            - 0 = extreme LEFT edge
            - 50 = horizontal CENTER
            - 100 = extreme RIGHT edge

            y:
            - 0 = extreme TOP edge
            - 50 = vertical CENTER
            - 100 = extreme BOTTOM edge

            The coordinate MUST point to the actual UI element or visual region causing the issue.

            DO NOT place a marker at the center of the screenshot unless the actual problem is located there.

            DO NOT use a generic or arbitrary position.

            For text-related issues:
            Place the marker directly over or immediately beside the problematic text.

            For button-related issues:
            Place the marker over the problematic button.

            For image-related issues:
            Place the marker over the problematic image.

            For spacing/layout issues:
            Place the marker near the actual spacing or alignment problem.

            For navigation/header issues:
            Place the marker on the affected navigation/header area.

            For issues affecting a broad section:
            Place the marker near the center of that affected section.

            IMPORTANT COORDINATE CALIBRATION:

            Before choosing x and y, mentally divide the screenshot into a 10 × 10 grid.

            Determine:
            1. Which horizontal section contains the problem.
            2. Which vertical section contains the problem.
            3. The approximate center of the actual problematic element.

            Then convert that location to percentages.

            For example:
            - search bar near the top-left → approximately x: 20, y: 15
            - center card → approximately x: 50, y: 55
            - bottom-right floating button → approximately x: 92, y: 94

            These are ONLY examples.
            Always calculate coordinates from the actual screenshot.

            The coordinate must describe the screenshot itself, not the position where the issue label should appear.

            Do NOT move coordinates to make room for the label.

            Do NOT invent exact pixel-level precision.
            Approximate visual coordinates are acceptable, but they must correspond to the actual visible element.

            QUALITY RULES:

            Do not create strengths just to fill space.

            Do not create issues that are not visually supported.

            Do not repeat the same issue.

            Prioritize issues that materially affect:
            - readability
            - accessibility
            - usability
            - hierarchy
            - layout
            - consistency
            - visual quality

            Return ONLY the requested JSON structure.
            `
            }
        ]
    };

    const response = await generateWithFallback(request);

    if (!response?.text) {
        throw new Error("Gemini returned an empty response.");
    }

    const parsed = JSON.parse(response.text);

if (Array.isArray(parsed.issues)) {
    parsed.issues = parsed.issues
        .map((issue) => {
            const x = Number(issue?.position?.x);
            const y = Number(issue?.position?.y);

            const hasValidPosition =
                Number.isFinite(x) &&
                Number.isFinite(y) &&
                x >= 0 &&
                x <= 100 &&
                y >= 0 &&
                y <= 100;

            if (!hasValidPosition) {
                console.warn(
                    "AI issue removed because of invalid position:",
                    issue?.title
                );

                return null;
            }

            return {
                ...issue,
                position: {
                    x: Math.min(Math.max(x, 0), 100),
                    y: Math.min(Math.max(y, 0), 100),
                },
            };
        })
        .filter(Boolean);
}

return parsed;
   
}

module.exports = {
    analyzeDesign
};