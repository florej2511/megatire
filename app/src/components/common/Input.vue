<template>
  <div class="height-full flex flex-col justify-center items-start w-full">
    <div class="relative w-full inputRequired" :class="props.typeColor ? ' w-4/5' : 'w-full'">
      <!-- Prepend Icon config  -->
      <Icon v-if="props.prependIcon" class="select-none absolute top-[10px] left-[10px]" :icon="props.prependIcon"></Icon>
      <!-- Icon only to password view -->
      <Icon v-if="props.type == 'password'" class="cursor-pointer absolute top-[6px] right-[10px] hover:text-primary"
        @pointerenter="viewPassword = true" @pointerleave="viewPassword = false" icon="visibility" />
      <input @click="selectAll" ref="input1" autocomplete="off" :name="props.nameInput" :placeholder="props.placeholder"
        class="text-base outline-none border-2 border-solid
            border-gray-500 px-3 text-gray-500 transition-all duration-200 ease-out 
            w-full accent-primary
            " :readonly="props.readonly ?? false" :class="[
              `focus:border-${props.color}-800`,
              props.size == 'xl' ? 'py-6' :
                props.size == 'lg' ? 'py-4' :
                  props.size == 'md' ? 'py-2' :
                    props.size == 'sm' ? 'py-1' : 'py-1',
              props.disabled ? 'bg-gray-100 cursor-not-allowed' : '',
              props.notificationColor ? `border-${props.notificationColor}-700` : 'border-gray-500',
              props.prependIcon ? 'pl-10' : null,
              props.rounded ?? 'rounded-md'
            ]" v-model="stringValue" :type="viewPassword == false ? props.type : 'text'" :required="props.required"
        :disabled="props.disabled" />
      <label v-if="props.label" for="input" class="absolute text-base font-bold top-[50%] -translate-y-1/2 bg-transparent  
            py-0 px-1 my-0 mx-2
            text-gray-600 ease-out transition-all duration-200
             origin-top-left pointer-events-none whitespace-nowrap overflow-x-hidden max-w-full"
        :style="{ '--bgColor': props.notificationColor }" :class="[
          props.notificationColor ? `text-${props.notificationColor}-700` : 'text-gray-600',
          props.prependIcon ? 'left-7' : 'left-0'
        ]">
        {{ props.label }}
      </label>
    </div>
    <div v-if="props.typeColor" class="w-1/5">
      <input @click="selectAll" ref="input2" autocomplete="off" type="color" class=" h-12" :name="props.nameInput"
        v-model="stringValue" @blur="emits('blur')">
    </div>
    <span v-if="props.hint" class="laptop:text-sm tablet:text-xs py-1" :class="`text-${props.hintColor ?? 'black'}`">
      {{ props.hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { toRefs, type Ref, ref, onBeforeMount, computed } from 'vue';
import Icon from '@/components/common/Icon.vue'
import { currencyFormat } from '@/utils/formaters';
export interface contentInput {
  color?: string
  placeholder?: string | undefined
  label?: string
  modelValue: string | number | undefined
  size?: string
  type?: string
  notificationColor?: string | undefined
  required?: boolean
  prependIcon?: string
  appendIcon?: string
  hint?: string
  hintColor?: string
  typeColor?: boolean
  readonly?: boolean
  disabled?: boolean
  nameInput?: string
  rounded?: string
  select?: boolean
  currency?: boolean
}
const emits = defineEmits(['update:modelValue', 'blur'])
const props = defineProps<contentInput>()
const viewPassword: Ref<boolean> = ref(false)
const input1 = ref()
const input2 = ref()

const selectAll = () => {
  if (props.select) {
    input1.value?.select()
    input2.value?.select()
  }
}

const stringValue = computed(
  {
    get(): string | number {
      let value = props.modelValue
      if(props.currency){
        value = currencyFormat(parseInt(value?.toString() ?? '0'), false)
      }
      return value ?? ''
    },
    set(newValue: string | number): void {
      const val = newValue.toString().replace('$', '').split(',').join('')
      emits('update:modelValue', val)
    }
  }
)

defineExpose({input1, input2, selectAll})

</script>
<style scoped>
input:focus+label {
  color: var(--bgColor);
  top: 0;
  transform: translateY(-85%) scale(0.9) !important;
}

input:not(:placeholder-shown)+label {
  top: 0;
  transform: translateY(-85%) scale(0.9) !important;
}

input:not(:focus)::placeholder {
  opacity: 0;
}

.inputRequired:has(input:required) label:after {
  content: ' *';
  color: black;
}
</style>