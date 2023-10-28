<template>
    <div class="material-symbols-outlined select-none" v-if="true">
        {{ props.icon}}
    </div>
    <div v-else>
      **
    </div>
</template>

<script setup lang="ts">
export interface contentIcon {
  icon: string
}
const props = defineProps<contentIcon>()
</script>