import { computed, reactive } from "vue";
// import { globalAlert } from "@/schemas";

export const alertMessageApp = reactive({
    title: '',
    description: '',
    type: '',
    show: false
})

export const fireAlert = (
    info: {
        title: string,
        dscp?: string,
        type: string
    },
    time: number = 2000
) => {
    alertMessageApp.show = true
    alertMessageApp.description = info.dscp ?? ''
    alertMessageApp.type = info.type
    alertMessageApp.title = info.title

    setTimeout(() => {
        alertMessageApp.show = false
        alertMessageApp.description = ''
        alertMessageApp.type = ''
        alertMessageApp.title = ''
    }, time);
}

export const fireErrorAlert = () => {
    fireAlert({
        title: 'An Error have occured',
        dscp: 'Please contact support',
        type: 'error'
    })
}