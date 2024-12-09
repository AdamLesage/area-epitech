<script setup lang="ts">
import { AreaValues } from '@/types/services';
import { Icon } from '@iconify/vue';

const props = defineProps<{
    values: AreaValues,
    icon: string,
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
    <div class="flex flex-col items-center justify-between w-[360px] h-[410px] border-2 border-auth-neutral rounded-xl">
        <div class="flex flex-col w-full h-[60%]">
            <header class="flex justify-between items-center w-full p-4">
                <div class="flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                        :style="{ backgroundColor: props.color }">
                        <Icon :icon="props.icon" class="w-12 h-12 text-white" />
                    </div>
                </div>
                <div class="flex flex-col justify-start">
                    <h1 class="font-semibold">
                        {{ props.values.title }}
                    </h1>
                    <h2>
                        {{ props.values.subtitle }}
                    </h2>
                </div>
                <div class="flex items-center justify-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-gray-100 hover:cursor-pointer"
                        @click.stop="handleMenuClick">
                        <Icon icon="charm:menu-kebab" class="w-6 h-6"
                            :style="{ color: props.color }" />
                    </div>
                </div>
            </header>
            <div class="w-full h-full">
                <!-- Hero (Screen or Video) -->
                <div class="w-full h-full"
                    :style="{ backgroundColor: color }">
                    <!-- Color div for now -->
                </div>
            </div>
        </div>
        <div class="h-[40%]">
            <!-- Body (Description + Actions) -->
            <div class="p-4">
                <h2 class="font-semibold">
                    {{ props.values.title }}
                </h2>
                <p class=text-sm>
                    {{ props.values.description }}
                </p>
            </div>
            <div class="flex items-center justify-end pr-4 gap-2">
                <button class="border-2 border-auth-neutral rounded-full py-2 px-6"
                    @click="handleMoreClick">
                    More
                </button>
                <button class="rounded-full py-2 px-6 text-white"
                    @click="handleConfigureClick"
                    :style="{ backgroundColor: color }">
                    Configure
                </button>
            </div>
        </div>
    </div>
</template>
