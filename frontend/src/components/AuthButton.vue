<template>
    <button
        class="bg-white w-[6.75rem] h-[3.25rem] rounded-lg border-2 border-auth-neutral flex justify-center items-center">
        <Icon :icon="icon" class="w-8 h-8" :style="{ color: color }" />
    </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
    color: string,
    icon: string
}>()
</script>
