<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Action } from '@/types/services';

const props = defineProps<{
    object: Action,
    color: string,
}>()

const emit = defineEmits(['menu-click', 'more-click', 'configure-click']);

function handleMenuClick() {
    emit('menu-click');
}

function handleMoreClick() {
    emit('more-click');
}

function handleConfigureClick() {
    emit('configure-click');
}
</script>

<template>
    <div class="flex flex-col items-center justify-between w-[340px] web:h-[180px] mobile:h-[140px] rounded-xl" :style="{ backgroundColor: color }">
        <div class="flex flex-col w-full h-full">
            <header class="flex flex-col justify-center items-start w-full h-full px-12 gap-2">
                <h1 class="font-black text-white text-xl">
                    {{ props.object.display_name }}
                </h1>
                <p class="font-semibold text-white text-lg">{{ props.object.description }}</p>
            </header>
        </div>
    </div>
</template>
