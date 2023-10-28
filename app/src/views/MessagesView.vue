<script setup lang="ts">
import Header from "@/components/Header.vue";
import { onMounted, ref, type Ref } from "vue";
import { globalStatus, setGlobal } from "@/utils/global";
import { MessageServices } from "@/services/messageServies";
import { ddmmyyyy, fulldate } from "../utils/formaters";
import { Icon } from "@/components/common";
import { useAuthStore } from "@/stores/auth";

const messages: Ref<any[]> = ref([])
const currentItem: Ref<any> = ref({})
const auth = useAuthStore()

const validatePeding = () => {
  let c = 0
  messages.value.forEach((msg) => {
    if (!msg.reviewed_at) c++;
  })
  auth.messages = c
}

const listMessages = async () => {
  const service = new MessageServices();
  const response = await service.listMessages({})
  messages.value = response.data ?? []
  validatePeding()
}

onMounted(async () => {
  setGlobal('title', 'Mensajes recibidos')
  listMessages()
})

const handleOpenMail = async (item: any) => {
  if (!item.reviewed_at) {
    const service = new MessageServices();
    const response = await service.validateMessage(item.id)
    messages.value = messages.value.map((msg) => {
      if (msg.id == item.id)
        msg = { ...item, ...response.data }
      return msg
    })
    validatePeding()
  }
  currentItem.value = item
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', 'Información')
}

</script>

<template>
  <Header>
    <template #main>
      <div class="w-full h-auto pt-5">
        <div class="py-1" v-for="(item, index) in messages" :key="index">
          <div
            class="w-full h-10 border overflow-hidden flex items-center px-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-opacity-50 duration-200 whitespace-nowrap"
            @click="handleOpenMail(item)" :class="[!item.reviewed_by ? 'border-primary' : '']">
            <div class="tablet:w-1/12 w-0 flex flex-col tablet:px-2 text-center overflow-hidden">
              <Icon icon="mail" v-if="!!item.reviewed_by" />
              <Icon icon="mark_email_unread" class="text-primary" v-else />
            </div>
            <div class="tablet:w-2/12 phone:w-1/3 flex flex-col px-2 border-x text-center overflow-hidden">
              {{ ddmmyyyy(item.date) }}
            </div>
            <div class="tablet:w-3/12 phone:w-2/3 flex flex-col px-2 border-x text-center overflow-hidden">
              {{ item.email }}
            </div>
            <div class="tablet:w-6/12 phone:w-0 flex tablet:px-3 overflow-hidden">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #helper>
      <div class="flex flex-wrap items-center">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Recibido:
        </span>
        <span class="tablet:w-2/3 phone:w-full text-sm italic">
          {{ fulldate(currentItem.date) }}
        </span>
      </div>
      <div class="flex flex-wrap items-center">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Envíado por:
        </span>
        <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
          {{ currentItem.email }}
        </span>
      </div>
      <div class="flex flex-wrap items-center">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Nombre:
        </span>
        <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
          {{ currentItem.fullname }}
        </span>
      </div>
      <div class="flex flex-wrap items-center">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Teléfono:
        </span>
        <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
          {{ currentItem.cellphone }}
        </span>
      </div>
      <div class="flex flex-wrap items-center">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Revisado:
        </span>
        <span class="tablet:w-2/3 phone:w-full text-sm italic">
          {{ fulldate(currentItem.reviewed_at) }}
        </span>
      </div>
      <div class="py-3 text-center border-y mt-2">
        <span class="tablet:w-1/3 phone:w-full text-lg">
          Contenido del mensaje:
        </span>
      </div>
      <div class="py-4">
        {{ currentItem.content }}
      </div>
    </template>
  </Header>
</template>

<style scoped></style>