import { reactive } from 'vue'

export const globalStatus = reactive({
    title: '',
    helperWindow: '',
    helperTitle: ''
})

export const setGlobal = (label: keyof typeof globalStatus, value: string = '') => {
    globalStatus[label] = value
}