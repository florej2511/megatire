<script setup lang="ts">
import Header from "@/components/Header.vue";
import { onMounted, ref, nextTick, type Ref, computed } from "vue";
import { setGlobal } from "@/utils/global";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import { VehicleService } from "@/services/vehicleService";
import UserCreationVue from "@/components/UserCreation.vue";

const filter = ref('')
const clients: Ref<any[]> = ref([])
const cancelToken: Ref<AbortController | undefined> = ref()
const currentItem: Ref<any> = ref({})
const newClient: Ref<any> = ref({})
const create: Ref<boolean> = ref(false)

onMounted(() => {
  setGlobal('title', 'Clientes')
  listClients()
})

const listClients = async () => {
  if (cancelToken.value) cancelToken.value.abort()

  cancelToken.value = new AbortController()

  const clientes = await new VehicleService().listClients({
    'fullname,cc_nit': `%%${filter.value}`
  }, cancelToken.value.signal)
  cancelToken.value = undefined

  clients.value = clientes.data ?? []
}

const saveClient = async () => {
  const data = await new VehicleService().saveClient(newClient.value)
  if(data.status == 200){
    let found = false
    clients.value = clients.value.map((c) => {
      if(c.id == data.data.id){
        found = true
        return data.data
      }
      return c
    })
    if(!found) clients.value.unshift(data.data)
  }
}

const createNewClient = async () => {
  create.value = false
  await nextTick()
  create.value = true
  currentItem.value = {}
  newClient.value= {}
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', 'Nuevo cliente')
}

const handleOpenHelper = (item: any) => {
  currentItem.value = item
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', 'Perfil de cliente')
}

const canSave = computed(() => {
  return true
})

</script>

<template>
  <Header>
    <template #main>
      <div class="flex w-full flex-wrap">
        <div class="w-full flex pt-5 flex-wrap">
          <div class="tablet:flex-1 phone:w-full tablet:pr-4 py-2">
            <Input v-model="filter" label="Filtrar clientes" placeholder="Filtrar clientes por nombre o identificación"
              @update:model-value="listClients" />
          </div>
          <div class="tablet:w-fit phone:w-full flex justify-end py-2">
            <Button content="Añadir/Editar" color="primary" exact-color class="tablet:w-40 phone:w-full"
              @click="createNewClient" />
          </div>
        </div>
        <div class="w-full h-auto pt-5">
          <div class="py-1" v-for="(item, index) in clients" :key="index">
            <div
              class="w-full h-10 border overflow-hidden flex items-center px-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-opacity-50 duration-200 whitespace-nowrap"
              @click="handleOpenHelper(item)" :class="[!item.reviewed_by ? 'border-primary' : '']">
              <div class="tablet:w-1/6 phone:w-1/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.cc_nit }}
              </div>
              <div class="tablet:w-3/6 phone:w-2/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.fullname }}
              </div>
              <div class="tablet:w-2/6 phone:w-0 flex tablet:px-3 overflow-hidden">
                {{ item.cellphone }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #helper>
      <div v-if="Object.keys(currentItem).length">
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Nombre completo:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.fullname }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Identificación:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.cc_nit }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Correo:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.email }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Celular:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.cellphone }}
          </span>
        </div>
        <div class="py-3 text-center border-y mt-2">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Vehículos:
          </span>
        </div>
        <div class="py-4">
          {{ '' }}
        </div>
      </div>
      <div v-else-if="create">
        <div class="flex flex-wrap items-center">
          <div class="w-full flex justify-end">
            <Button content="Guardar" class="w-28" color="primary" exact-color
            :class="[!canSave ? 'invisible': '']" @click="saveClient"/>
          </div>
          <UserCreationVue :current-user="newClient" @update:current-user="(e: any) => newClient = e"/>
        </div>
      </div>
    </template>
  </Header>
</template>

<style scoped></style>