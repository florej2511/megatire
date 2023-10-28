<script setup lang="ts">

import {computed, onMounted, nextTick, ref, type Ref} from "vue";
import {setGlobal} from "@/utils/global";
import Header from "@/components/Header.vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import {VehicleService} from "@/services/vehicleService";
import VehicleCreationVue from "@/components/VehicleCreation.vue";

const filter = ref('')
const vehicules: Ref<any[]> = ref([])
const currentItem: Ref<any> = ref({})
const abortController: Ref<undefined | AbortController> = ref()
const newVehicle: Ref<any> = ref({})
const create: Ref<boolean> = ref(false)

const listVehicles = async () => {
  if(abortController.value) abortController.value.abort();

  abortController.value = new AbortController()

  const service = new VehicleService()
  const response = await service.listVehicles({
    plate: `%%${filter.value}`
  }, abortController.value.signal)
  abortController.value = undefined

  vehicules.value = response.data
}

onMounted(() => {
  setGlobal('title', 'Vehiculos')
  listVehicles()
})

const handleOpenHelper = (item: any) => {
  currentItem.value = item
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', item.plate)
}

const createNewVehicle = async () => {
  create.value = false
  await nextTick()
  create.value = true
  currentItem.value = {}
  newVehicle.value = {}
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', 'Añadir nuevo vehículo')
}

const canSave = computed(() => {
  return newVehicle.value['plate'] && newVehicle.value['tipo'] && newVehicle.value['cc_nit'] &&
  newVehicle.value['fullname'] && newVehicle.value['email'] && newVehicle.value['cellphone']
})

const saveVehicle = async () => {
  const data = await new VehicleService().saveVehicle(newVehicle.value)
  if(data.status == 200){
    let found = false
    vehicules.value = vehicules.value.map((v) => {
      if(v.id == data.data.id){
        found = true
        return data.data
      }
      return v
    })
    if(!found) vehicules.value.unshift(data.data)
    setGlobal('helperWindow')
  }
}

</script>

<template>
  <Header>
    <template #main>
      <div class="flex w-full flex-wrap">
        <div class="w-full flex pt-5 flex-wrap">
          <div class="tablet:flex-1 phone:w-full tablet:pr-4 py-2">
            <Input v-model="filter" label="Filtrar vehículos" placeholder="Filtrar vehículos por placa" @update:model-value="listVehicles"/>
          </div>
          <div class="tablet:w-fit phone:w-full flex justify-end py-2">
            <Button content="Añadir/Editar" color="primary" exact-color class="tablet:w-40 phone:w-full" @click="createNewVehicle"/>
          </div>
        </div>
        <div class="w-full h-auto pt-5">
          <div class="py-1" v-for="(item, index) in vehicules" :key="index">
            <div
              class="w-full h-10 border overflow-hidden flex items-center px-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-opacity-50 duration-200 whitespace-nowrap"
              @click="handleOpenHelper(item)" :class="[!item.reviewed_by ? 'border-primary' : '']">
              <div class="tablet:w-1/6 phone:w-1/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.plate }}
              </div>
              <div class="tablet:w-3/6 phone:w-2/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.fullname }}
              </div>
              <div class="tablet:w-3/6 phone:w-0 flex tablet:px-3 overflow-hidden">
                {{ item.cc_nit }}
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
            Dueño:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.fullname }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Correo:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
            {{ currentItem.email }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Identificación:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
            {{ currentItem.cc_nit }}
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
            Vehículo:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currentItem.tipo }}
          </span>
        </div>
        <div class="py-3 text-center border-y mt-2">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Servicios:
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
            :class="[!canSave ? 'invisible': '']" @click="saveVehicle"/>
          </div>
          <VehicleCreationVue :current-register="newVehicle" @update:current-register="(e) => newVehicle = e"/>
        </div>
      </div>
    </template>
  </Header>
</template>

<style scoped>

</style>