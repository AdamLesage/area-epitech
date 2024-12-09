
<template>
    <section class="bg-indigo-600 rounded-xl shadow-lg p-6" aria-labelledby="explore-label">
        <h2 id="explore-label" class="text-2xl font-bold tracking-wide mb-6">Explore</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
                v-for="platform in platforms"
                :key="platform.name"
                :class="['flex flex-col items-center p-4 rounded-lg hover:bg-opacity-75 transition-transform transform hover:scale-105', platform.color]"
                :aria-label="`Explore ${platform.name}`"
                role="button"
                tabindex="0">
                <Icon :icon="platform.icon" class="text-4xl mb-2" aria-hidden="true" />
                <span class="text-lg font-medium">{{ platform.name }}</span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Icon } from '@iconify/vue';


// platforms list
defineProps<{
    platforms: Array<{
        name: string;
        color: string;
        icon: string;
    }>;
}>();
</script>
