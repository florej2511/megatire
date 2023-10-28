import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { storeKeys } from '@/config'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref({})
    const api_token = ref('')
    const router = useRouter();
    const messages = ref(0)

    const logged = computed(() => {
        return Object.keys(user.value).length > 0 && api_token.value.length > 0
    })
  
    const login = (logged: any, token: string) => {
        router.push({name: 'admin-dashboard'})
        api_token.value = token
        user.value = logged

        window.localStorage.setItem(storeKeys.userSchema, JSON.stringify(logged));
        window.localStorage.setItem(storeKeys.userToken, token)
    }

    const retrieve = () => {
        if(window.localStorage.getItem(storeKeys.userSchema) && window.localStorage.getItem(storeKeys.userSchema) != undefined && window.localStorage.getItem(storeKeys.userSchema) != "undefined"){
            user.value = JSON.parse(window.localStorage.getItem(storeKeys.userSchema)!)
        }else{
            user.value = {}
        }
        
        api_token.value = window.localStorage.getItem(storeKeys.userToken) ?? ''
    }

    const logout = () => {
        user.value = {}
        window.localStorage.clear()
        router.push({name: 'admin-login'})
    }

    return {
        user, api_token, logged, messages, login, logout, retrieve
    }
})
