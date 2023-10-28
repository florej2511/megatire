import { useAuthStore } from "@/stores/auth"
import axios  from "./axios"

export class VehicleService {

    constructor() {
        const auth = useAuthStore()
        axios.defaults.headers['Authorization'] = `Bearer ${auth?.api_token}`
    }

    async listVehicles(payload: any, signal: AbortSignal) {
        return await axios.get('vehicles', {
            params: payload,
            signal
        })
    }

    async listClients(payload: any, signal: AbortSignal ){
        return await axios.get('clients', {
            params: payload,
            signal
        })
    }

    async saveVehicle(payload: any){
        return await axios.post('vehicles', payload)
    }

    async saveService(payload: any){
        return await axios.post('services', payload)
    }

    async saveClient(payload: any){
        return await axios.post('clients', payload)
    }

    async listServices(payload: any, signal: AbortSignal){
        return await axios.get('services', {
            params: payload,
            signal
        })
    }
}