import axios from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

export class MessageServices{

    constructor() {
        const auth = useAuthStore()
        axios.defaults.headers['Authorization'] = `Bearer ${auth.api_token}`
    }

    async listMessages(payload: any){
        return await axios.get('messages', {
            params: payload,
        })
    }

    async validateMessage(id: number){
        return await axios.post(`messages/${id}`)
    }
}