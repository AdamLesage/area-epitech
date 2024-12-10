
<template>
    <section class="bg-indigo-600 rounded-xl shadow-lg p-6" aria-labelledby="explore-label">
        <h2 id="explore-label" class="text-2xl font-bold tracking-wide mb-6">Explore</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
                v-for="service in services"
                :key="service.name"
                class="flex flex-col items-center p-4 rounded-lg hover:bg-opacity-75 transition-transform transform hover:scale-105"
                :style="{ backgroundColor: service.color }"
                :aria-label="`Explore ${service.name}`"
                role="button"
                tabindex="0"
                @click="handleServiceClick(service.name)">
                <Icon :icon="service.icon" class="text-4xl mb-2" aria-hidden="true" />
                <span class="text-lg font-medium">{{ service.name }}</span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { Icon } from '@iconify/vue';

// services list
const props = defineProps<{
    services: Array<{
        name: string;
        color: string;
        icon: string;
    }>;
}>();

watch(() => props.services, (services) => {
    console.log('Services:', services);
});

const emit = defineEmits(['click']);

const handleServiceClick = (name: string) => {
    emit('click', name)
};
</script>
