import api from "./api"

export async function analyzeDesign(designId) {
    const response = await api.post(`/analysis/${designId}`)

    return response.data
}

export async function getAnalysis(analysisId) {
    const response = await api.get(`/analysis/${analysisId}`)

    return response.data
}

export async function getDesignAnalyses(designId) {
    const response = await api.get(`/analysis/design/${designId}`)

    return response.data
}
export async function getUserAnalyses() {
    const response = await api.get("/analysis/history")

    return response.data
}