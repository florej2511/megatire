<script setup lang="ts">
import { type Ref, ref, onMounted, watch } from "vue";
import Input from "./common/Input.vue";
import { UserServices } from "@/services/userServices";
import { VehicleService } from "@/services/vehicleService";

const props = defineProps<{
  currentUser: any
}>()
const emits = defineEmits(['update:currentUser'])

const exists = ref(false)
const fetched = ref(false)
const cancelToken: Ref<undefined | AbortController> = ref()
const timeout: Ref<number | undefined> = ref(undefined)

const listUser = async () => {
  console.log('listing')
  if (cancelToken.value) cancelToken.value.abort()
  cancelToken.value = new AbortController()

  const response = await new VehicleService().listClients({
    cc_nit: props.currentUser.cc_nit
  }, cancelToken.value?.signal)
  cancelToken.value = undefined
  fetched.value = true
  if (response.data.length == 1) {
    exists.value = true
    emits('update:currentUser', {
      ...props.currentUser, ...response.data[0]
    })
  } else {
    exists.value = false
  }
}

const awaiter = async () => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    listUser()
  }, 1000);
}

onMounted(() => {
  console.log(props.currentUser.cc_nit)
  if(props.currentUser.cc_nit){
    listUser()
  }
})

watch(
  () => props.currentUser.cc_nit,
  () => {
    awaiter()
  }
)

</script>

<template>
  <div class="flex flex-wrap items-center w-full">
    <div class="pt-6 w-full">
      <Input v-model="props.currentUser.cc_nit" placeholder="Digite el NIT o la Cédula" label="Identificación" />
    </div>
    <div v-if="fetched" class="w-full">
      <div class="pt-6 w-full">
        <Input v-model="currentUser.fullname" placeholder="Digite el nombre completo" label="Nombre"/>
      </div>
      <div class="pt-6 w-full">
        <Input v-model="currentUser.email" placeholder="Digite el correo eletrónico" label="Correo eletrónico"/>
      </div>
      <div class="pt-6 w-full">
        <Input v-model="currentUser.cellphone" placeholder="Digite el celular o teléfono" label="Celular"/>
      </div>   
    </div>
  </div>
</template>

<style scoped></style>