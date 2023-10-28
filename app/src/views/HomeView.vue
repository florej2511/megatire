<script setup lang="ts">
import Header from "@/components/Header.vue";
import { computed, nextTick, onMounted, ref, type Ref } from "vue";
import { globalStatus, setGlobal } from "@/utils/global";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import { VehicleService } from "@/services/vehicleService";
import VehicleCreation from "@/components/VehicleCreation.vue";
import { currencyFormat } from "@/utils/formaters";

const filter = ref('')
const token: Ref<undefined | AbortController> = ref()
const services: Ref<any[]> = ref([])
const create: Ref<boolean> = ref(false)
const currentItem: Ref<any> = ref({})
const newService: Ref<any> = ref({})

const listServices = async () => {
  if (token.value) token.value.abort()
  token.value = new AbortController()

  const response = await new VehicleService().listServices({
    'v.plate': `%%${filter.value}`
  }, token.value.signal)
  token.value = undefined

  services.value = response.data
}

const saveService = async () => {
  const data = await new VehicleService().saveService(newService.value)
  if(data.status == 200){
    services.value.unshift(data.data)
  }
  setGlobal('helperWindow')
}

const createNewService = async () => {
  create.value = false
  await nextTick()
  create.value = true
  currentItem.value = {}
  newService.value = {}
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', 'Añadir nuevo servicio')
}

const handleOpenHelper = (item: any) => {
  currentItem.value = item
  setGlobal('helperWindow', 'ok')
  setGlobal('helperTitle', item.plate)
}

onMounted(() => {
  setGlobal('title', 'Servicios');
  setGlobal('helperTitle', 'Agregar nuevo servicio')
  listServices()
})
const canSave = computed(() => {
  return newService.value['plate'] && newService.value['tipo'] && newService.value['cc_nit'] &&
  newService.value['fullname'] && newService.value['email'] && newService.value['cellphone'] && 
  newService.value['description']
})

</script>

<template>
  <Header>
    <template #main>
      <div class="flex w-full flex-wrap">
        <div class="w-full flex pt-5 flex-wrap">
          <div class="tablet:flex-1 phone:w-full tablet:pr-4 py-2">
            <Input v-model="filter" label="Filtrar servicios" placeholder="Filtrar servicios por placa"
              @update:model-value="listServices" />
          </div>
          <div class="tablet:w-fit phone:w-full flex justify-end py-2">
            <Button content="Registrar" color="primary" exact-color class="tablet:w-40 phone:w-full"
              @click="createNewService" />
          </div>
        </div>
        <div class="w-full h-auto pt-5">
          <div class="py-1" v-for="(item, index) in services" :key="index">
            <div
              class="w-full h-10 border overflow-hidden flex items-center px-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-opacity-50 duration-200 whitespace-nowrap"
              @click="handleOpenHelper(item)" :class="[!item.reviewed_by ? 'border-primary' : '']">
              <div class="tablet:w-1/6 phone:w-1/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.plate }}
              </div>
              <div class="tablet:w-1/6 phone:w-0 flex tablet:px-3 overflow-hidden">
                {{ currencyFormat(item.price) }}
              </div>
              <div class="tablet:w-4/6 phone:w-2/3 flex flex-col px-2 border-x text-center overflow-hidden">
                {{ item.description }}
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
            Vehículo:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic cursor-pointer">
            {{ currentItem.tipo }}
          </span>
        </div>
        <div class="flex flex-wrap items-center">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Precio:
          </span>
          <span class="tablet:w-2/3 phone:w-full text-sm italic">
            {{ currencyFormat(currentItem.price) }}
          </span>
        </div>
        <div class="py-3 text-center border-y mt-2">
          <span class="tablet:w-1/3 phone:w-full text-lg">
            Descripción:
          </span>
        </div>
        <div class="py-4">
          {{ currentItem.description }}
        </div>
      </div>
      <div v-else-if="create">
        <div class="flex flex-wrap items-center">
          <div class="w-full flex justify-end py-6">
            <Button content="Guardar" class="w-28" color="primary" exact-color :class="[!canSave ? 'invisible' : '']"
              @click="saveService" />
          </div>
          <div class="w-full">
            <Input v-model="newService.description" label="Trabajo realizado" placeholder="Digite información sobre el trabajo realizado" />
          </div>
          <div class="w-full pt-6">
            <Input v-model="newService.price" currency label="Precio del trabajo" placeholder="Información del precio del trabajo" 
            select/>
          </div>
          <VehicleCreation :current-register="newService" @update:current-register="(e) => newService = e" />
        </div>
      </div>
    </template>
  </Header>
</template>
