import api from './api'

export async function registerUser(userData) {
    const response = await api.post('/auth/register',userData)
    return response.data
}

export async function loginUser(userData){
    const response = await api.post('/auth/login',userData)
    return response.data
}

export async function logoutUser() {
    const response= await api.get('/auth/logout')
    return response.data
}

export async function getUser() {
    const response = await api.get('/auth/getUser')
    return response.data
}