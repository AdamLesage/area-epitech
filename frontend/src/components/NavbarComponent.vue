<template>
    <header class="flex flex-col md:flex-row items-center justify-between bg-indigo-900 py-4 px-8 shadow-lg">
        <h1 class="text-3xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer" @click="navigateTo('/dashboard')">AREA</h1>
        <nav class="flex flex-col md:flex-row gap-4 md:gap-6" aria-label="Primary Navigation">
            <button
                v-for="link in headerLinks"
                :key="link.name"
                @click="navigateTo(link.route)"
                class="flex items-center gap-2 text-lg font-medium bg-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105"
                :aria-label="`Navigate to ${link.name}`">
                <Icon :icon="link.icon" class="text-2xl" aria-hidden="true" />
                {{ link.name }}
            </button>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();

// Header links
const headerLinks = [
    { name: 'Explore', icon: 'mdi:compass-outline', route: '/explore' },
    { name: 'My Areas', icon: 'mdi:folder-outline', route: '/areas' },
    { name: 'Updates', icon: 'mdi:bell-outline', route: '/updates' },
    { name: 'Profile', icon: 'mdi:account-outline', route: '/userinfo' },
];


// Navigate to route
const navigateTo = (route: string) => {
    if (router) {
        router.push(route);
    } else {
        console.error('Router is not defined');
    }
};
</script>


