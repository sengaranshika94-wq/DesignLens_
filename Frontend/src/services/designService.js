import api from "./api"

export async function getDesigns() {
    const response = await api.get("/designs/")
    return response.data
}

export async function createDesign(file, title) {

    // FormData is required because we're sending a file
    const formData = new FormData()

    // This name MUST match upload.single("screenshot")
    formData.append("screenshot", file)

    // Add the design title
    formData.append("title", title)

    const response = await api.post("/designs/", formData)

    return response.data
}