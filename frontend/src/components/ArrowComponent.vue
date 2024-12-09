<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
    color: string,
}>()
</script>

<template>
    <Icon icon="solar:arrow-down-bold-duotone" class="w-6 h-6 animation-up-down" :style="{ color: color }" />
</template>

<style scoped>
@keyframes upDown {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animation-up-down {
    animation: upDown 1.5s infinite;
}
</style>
