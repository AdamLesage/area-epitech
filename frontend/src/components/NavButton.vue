<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
    icon: string,
    text: string,
}>()

const emit = defineEmits(['redirect']);
const handleRedirect = () => {
    emit('redirect', props.text);
}
</script>

<template>
    <button class="flex flex-col items-center justify-between" @click="handleRedirect">
        <Icon :icon="icon" class="w-8 h-8 text-white" v-if="props.text"/>
        <Icon :icon="icon" class="w-12 h-12 text-white" v-else/>
        <span class="text-xs text-white" v-if="props.text">{{ props.text }}</span>
    </button>
</template>
