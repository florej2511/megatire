<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { Icon } from './common';
import {globalStatus, setGlobal} from "../utils/global";
import {useRouter} from "vue-router";
import {onClickOutside} from "@vueuse/core";
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const auth = useAuthStore()
const sidebarContainer: Ref<HTMLElement | undefined> = ref();
const helperWindow: Ref<HTMLElement | undefined> = ref();
const status = ref(false);

onClickOutside(helperWindow, () => {
    setGlobal('helperWindow', '')
})

</script>

<template>
    <div class="flex w-full h-full relative content-start flex-wrap overflow-x-hidden overflow-y-auto">
        <div class="fixed w-16 tablet:h-full tablet:rounded-none shrink-0 duration-200 overflow-hidden bg-third flex justify-between items-center select-none flex-col py-3 text-white"
            :class="[status ? 'h-full' : 'phone:h-16 phone:rounded-br-lg']"
        ref="sidebarContainer">
            <div class="flex flex-col">
                <div class="flex cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200" @click="status = !status">
                    <Icon icon="menu" />
                </div>
                <div class="pt-5 pb-2">
                    <div class="flex relative items-center text-white font-bold cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200 "
                    @click="router.push({name: 'admin-messages'})">
                        <Icon icon="notifications" />
                        <span class="phone:hidden tablet:flex"></span>
                        <span class="absolute -right-1 -top-1 bg-white h-5 w-5 flex justify-center items-center text-primary rounded-full text-xs">
                            {{ auth.messages > 9 ? '9+' : auth.messages }}
                        </span>
                    </div>
                </div>
                <div class="py-2">
                    <div class="flex cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200 "
                    @click="router.push({name: 'admin-dashboard'})">
                        <Icon icon="receipt_long" class="w-full" />
                    </div>
                </div>
                <div class="py-2">
                    <div class="flex cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200"
                    @click="router.push({name: 'admin-clientes'})">
                        <Icon icon="groups" />
                    </div>
                </div>
                <div class="py-2">
                    <div class="flex cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200"
                    @click="router.push({name: 'admin-vehicles'})">
                        <Icon icon="directions_car" />
                    </div>
                </div>
            </div>
            <div class="flex cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-100 hover:text-primary px-3 py-2 rounded-lg duration-200 overflow-auto"
            @click="auth.logout()">
                <Icon icon="logout" />
            </div>
        </div>
        <div class="pl-20 w-full h-16 border flex justify-start items-center">
            <span class="font-bold tablet:text-3xl phone:text-sm">
                {{globalStatus.title}}
            </span>
        </div>
        <div class="tablet:pl-20 pt-2 duration-200 w-full pr-4 flex overflow-auto" :class="[status ? 'pl-20' : 'pl-4']">
            <slot name="main"></slot>
        </div>
      <div class="absolute h-screen content-start overflow-y-auto overflow-x-hidden pb-5 top-0 right-0 tablet:w-[60vw] phone:w-full border-l border-primary bg-white duration-500 flex flex-row flex-wrap px-5" :class="[!globalStatus.helperWindow ? 'translate-x-[101%]' : 'translate-x-0']"
      ref="helperWindow">
            <div class="w-full h-16 flex items-center border-b">
                <div class="border-primary border px-2 py-1 rounded-lg text-primary cursor-pointer hover:text-white hover:bg-primary duration-200 flex items-center justify-center" @click="setGlobal('helperWindow', '')">
                    <Icon icon="double_arrow" />
                </div>
                <div class="pl-5 tablet:text-4xl phone:text-base flex-1 text-center whitespace-nowrap">
                    {{ globalStatus.helperTitle }}
                </div>
            </div>
            <div class="pt-4 w-full">
                <slot name="helper"></slot>
            </div>
      </div>
    </div>
</template>

<style scoped></style>