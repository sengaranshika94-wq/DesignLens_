const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    design: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "designs",
        required: true
    },

    overallScore: {
        type: Number,
        required: true
    },

    summary: {
        type: String,
        default: ""
    },

    categoryScores: {
        visualDesign: {
            type: Number,
            required: true
        },

        ux: {
            type: Number,
            required: true
        },

        accessibility: {
            type: Number,
            required: true
        },

        typography: {
            type: Number,
            required: true
        },

        layout: {
            type: Number,
            required: true
        },

        consistency: {
            type: Number,
            required: true
        }
    },

    strengths: {
        type: Array,
        default: []
    },

    issues: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

const analysisModel = mongoose.model(
    "analyses",
    analysisSchema
);

module.exports = analysisModel;