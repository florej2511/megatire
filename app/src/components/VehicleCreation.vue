<script setup lang="ts">
import { VehicleService } from '@/services/vehicleService';
import { ref, type Ref } from 'vue';
import Input from './common/Input.vue';
import UserCreation from './UserCreation.vue';

const props = defineProps<{
    currentRegister: any
}>()
const emits = defineEmits(['update:currentRegister'])

const exists = ref(false)
const fetched = ref(false)
const cancelToken: Ref<undefined | AbortController> = ref()
const timeout: Ref<number | undefined> = ref(undefined)

const listUser = async () => {
    if (cancelToken.value) cancelToken.value.abort()
    cancelToken.value = new AbortController()

    const response = await new VehicleService().listVehicles({
        plate: props.currentRegister.plate
    }, cancelToken.value?.signal)
    cancelToken.value = undefined
    fetched.value = true
    if (response.data.length == 1) {
        exists.value = true
        emits('update:currentRegister', {
            ...props.currentRegister, ...response.data[0]
        })
    } else {
        exists.value = false
        emits('update:currentRegister', {
            plate: props.currentRegister.plate
        })
    }
}

const awaiter = async () => {
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
        listUser()
    }, 1000);
}

</script>

<template>
    <div class="flex flex-wrap items-center w-full">
        <div class="pt-6 w-full">
            <Input v-model="props.currentRegister.plate" placeholder="Digite la placa del vehículo" label="Placa"
                @keyup="awaiter" />
        </div>
        <div v-if="fetched" class="w-full">
            <div class="pt-6 w-full">
                <Input v-model="props.currentRegister.tipo" placeholder="Digite Moto o Carro" label="Tipo de vehículo"/>
            </div>
            <UserCreation :current-user="props.currentRegister" @update:current-user="(e) => emits('update:currentRegister', e) "/>
        </div>
    </div>
</template>

<style scoped></style>