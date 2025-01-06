<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
    color: string,
    direction: string,
    animate: boolean,
}>()
</script>

<template>
    <!-- Arrow component -->
    <div class="-rotate-90 w-fit h-fit" v-if="direction == 'top'">
        <Icon icon="iconamoon:arrow-right-2-light"
            class="w-12 h-12"
            :class="animate ? 'animation-left-right' : ''"
            :style="{ color: color }" />
    </div>
    <div class="rotate-90 w-fit h-fit" v-else-if="direction == 'bottom'">
        <Icon icon="iconamoon:arrow-right-2-light"
            class="w-12 h-12"
            :class="animate ? 'animation-left-right' : ''"
            :style="{ color: color }" />
    </div>
    <div class="rotate-180 w-fit h-fit" v-else-if="direction == 'left'">
        <Icon icon="iconamoon:arrow-right-2-light"
            class="w-12 h-12"
            :class="animate ? 'animation-left-right' : ''"
            :style="{ color: color }" />
    </div>
    <div class="w-fit h-fit" v-else-if="direction == 'right'">
        <Icon icon="iconamoon:arrow-right-2-light"
            class="w-12 h-12"
            :class="animate ? 'animation-left-right' : ''"
            :style="{ color: color }" />
    </div>
</template>

<style scoped>
@keyframes leftRight {
    0%, 100% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(-10px);
    }
}

.animation-left-right {
    animation: leftRight 1s infinite;
}
</style>
