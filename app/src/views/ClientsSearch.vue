<template>
    <div class="w-screen h-screen overflow-x-hidden overflow-y-auto flex flex-col justify-start">
        <header class="select-none bg-white w-screen z-20 flex items-center justify-between py-4 px-5 h-20">
            <img class="w-40 h-auto cursor-pointer" src="/public/logo.png" alt="Logo">
            <div class="laptop:hidden phone:flex cursor-pointer duration-200 p-2 truncate rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 overflow-hidden"
                @click="toHomePage">
                Volver a la página
            </div>
            <nav class="phone:hidden laptop:flex px-3 flex text-xl items-center h-full">
                <a class="cursor-pointer hover:text-primary hover:font-bold duration-200 px-2 text-center" href="/">
                    Inicio
                </a>
                <a class="cursor-pointer hover:text-primary hover:font-bold duration-200 px-2 text-center" href="/sedes">
                    Sedes
                </a>
                <a class="cursor-pointer hover:text-primary hover:font-bold duration-200 px-2 text-center" href="/contacto">
                    Contacto
                </a>
                <a class="cursor-pointer hover:text-primary hover:font-bold duration-200 px-2 text-center"
                    href="/servicios">
                    Servicios
                </a>
            </nav>
        </header>

        <section class="w-full h-auto py-6 flex flex-wrap justify-between">
            <div class="tablet:w-2/3 phone:w-full tablet:pr-4 pl-2 py-2">
                <Input class="" v-model="filter" label="Filtrar servicios"
                    placeholder="Filtrar por CC/NIT o placa" @update:model-value="null" />
            </div>
            <div class="tablet:w-1/3 phone:w-full tablet:pr-4 py-2">
                <Button class="w-full" content="Consultar" color="primary" exact-color @click="listServices" />
            </div>
        </section>

        <section class="w-full flex flex-wrap py-10">
            <template v-if="services.length > 0">
                <div class="w-full flex flex-wrap px-3">
                    <div class="w-full border rounded-lg px-3 py-2 flex mt-1" v-for="(service, index) in services" :key="index">
                        <div class="phone:w-1/3 laptop:w-1/6 tablet:w-1/6 flex justify-center items-center flex-col">
                            <span>
                                {{ moment(service.date).format('YYYY-MM-DD') }}
                            </span>
                            <span>
                                {{ moment(service.date).format('HH:mm') }}
                            </span>
                        </div>
                        <div class="phone:hidden tablet:flex laptop:w-3/6 tablet:w-1/2 justify-center items-center px-2">
                            {{ (service.description as string).recortar() }}
                        </div>
                        <div class="phone:w-1/3 laptop:w-1/6 tablet:w-1/6 justify-center items-center flex">
                            {{ service.plate }}
                        </div>
                        <div class="phone:w-1/3 laptop:w-1/6 tablet:w-1/6 justify-end items-center flex">
                            {{ currencyFormat(parseInt(service.price)) }}
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="w-full px-5 italic text-center">
                    Aquí podrá visualizar los servicios registrados en nuestra plataforma. Si no encuentra ninguno es porque
                    no ha consultado o no se han encontrado registros disponibles.
                </div>
            </template>
        </section>
    </div>
</template>


<script lang="ts" setup>
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import { ref, type Ref } from 'vue';
import { VehicleService } from '@/services/vehicleService'
import moment from 'moment';
import { currencyFormat } from '@/utils/formaters';

const filter = ref()
const services: Ref<any[]> = ref([])

const toHomePage = () => {
    window.location.href = '/'
}

const token: Ref<AbortController | undefined> = ref()

const listServices = async () => {
    if (token.value) token.value.abort()
    token.value = new AbortController()

    const response = await new VehicleService().listServices({
        'c.cc_nit, v.plate': `%%${filter.value}`
    }, token.value.signal)
    token.value = undefined

    services.value = response.data
}


</script>