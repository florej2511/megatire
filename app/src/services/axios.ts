import axios, { AxiosError, type AxiosResponse } from 'axios'
import { backendURL } from '@/config'
import { useAuthStore } from '@/stores/auth'

axios.defaults.baseURL = backendURL

axios.interceptors.response.use((response: AxiosResponse) => {
    return response
}, (response: AxiosError) => {
    if(401 == response.response?.status){
        console.log('here')
        const auth = useAuthStore()
        auth.logout()
    }
})


export default axios

