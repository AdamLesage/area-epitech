<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
    color: string,
    animate: boolean
}>()
</script>

<template>
    <Icon icon="iconamoon:arrow-up-2-light"
        :class="'w-12 h-12 ' + (animate ? 'animation-up-down' : '')"
        :style="{ color: color }" />
</template>

<style scoped>
@keyframes upDown {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(10px);
    }
}

.animation-up-down {
    animation: upDown 1.5s infinite;
}
</style>
