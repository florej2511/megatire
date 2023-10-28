<template>
    <button class="flex items-center justify-center shadow-lg border-2 rounded-lg  gap-2 duration-300 transform-click
     select-none"
   :class="[
       props.size == 'lg' ? 'px-3 py-2' :
       props.size == 'md' ? 'px-2 py-1' :
       props.size == 'sm' ? 'px-1 py-1' : 
       props.size == 'xs' ? 'px-1' : 'px-1 py-1',
       exactColor ? `border-${props.color} text-${props.color} hover:text-white ${ !props.active ? 'hover:' : ''}bg-${props.color} ${ !props.active ? 'hover:' : ''}text-white
       ${ !props.active ? 'hover:' : ''}font-bold` : 
       `border-${props.color}-600 text-${props.color}-600 ${ !props.active ? 'hover:' : ''}bg-${props.color}-600`,
       `disabled:bg-gray-300 disabled:${ !props.active ? 'hover:' : ''}bg-gray-300 disabled:border-none disabled:text-white`,
       props.disabled ? 'hover:bg-opacity-10' : '',
   ]"
   >
       <Icon :class="[props.size == 'xs' ? 'tablet:text-sm phone:text-xs' : '']" v-if="props.icon" :icon="props.icon" />
       <span v-if="props.content" :class="[
           props.size == 'xs' ? 'tablet:text-sm phone:text-xs' : 'tablet:text-base phone:text-sm'
       ]">{{ props.content}}</span>
   </button>
</template>
<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
export interface contentButton {
 icon?: string
 content?: string | undefined
 color: string
 size?: string
 exactColor?: boolean
 disabled?: boolean
 active?: boolean
}
const props = defineProps<contentButton>()
</script>

<style>
.transform-click:active{
   font-weight: bold;
}
</style>
