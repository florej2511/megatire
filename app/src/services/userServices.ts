import type { UserSchema } from '@/schemas/index';
import axios from '@/services/axios'

export class UserServices{
    
    constructor(){
        

    }

    public async login(payload: UserSchema){
        return await axios.post('user/login', payload);
    }

    public async register(payload: UserSchema){
        return await axios.post('user/register', payload);
    }

    public async recovery(payload: UserSchema){
        return await axios.post('user/recovery', payload)
    }
    
}

