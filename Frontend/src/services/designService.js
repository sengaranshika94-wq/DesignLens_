import api from './api'

export async function getDesigns(){
    const response = await api.get('/designs/')
    return response.data   
}