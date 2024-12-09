
<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
        <!-- Navbar -->
        <NavbarComponent />

        <div class="flex flex-col md:flex-row h-full">
            <!-- Sidebar: Updates -->
            <UpdatesSidebar :updates="updates" />

            <!-- Main Content -->
            <main class="flex-1 bg-gray-900 p-5 grid grid-rows-4 gap-4">
                <!-- Search Bar -->
                <SearchBarComponent />

                <!-- Suggestions and Explore -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SuggestionsComponent />
                    <ExplorePlatformsComponent :platforms="connectedPlatforms" />
                </div>
            </main>
        </div>
    </div>
</template>


<script setup lang="ts">
import NavbarComponent from '../components/NavbarComponent.vue'; // Import the NavbarComponent
import UpdatesSidebar from '../components/UpdatesSidebar.vue'; // Import the UpdatesSidebar
import SearchBarComponent from '../components/SearchBarComponent.vue'; // Import the SearchBarComponent
import SuggestionsComponent from '../components/SuggestionsComponent.vue'; // Import the SuggestionsComponent
import ExplorePlatformsComponent from '../components/ExplorePlatformsComponent.vue'; // Import the ExplorePlatformsComponent

import { ref } from 'vue';

// updates infos
const updates = ref([
    { id: 1, content: '✅ Created Login Page' },
    { id: 2, content: '✅ Created Register Page' },
    { id: 3, content: '✅ Added User Info Page' },
    { id: 4, content: '🚧 Started Home Page' },
    { id: 5, content: '🚧 Backend API Integration' },
]);


//Avaible plateforms
const connectedPlatforms = ref([
    { name: 'Spotify', icon: 'mdi:spotify', color: 'bg-green-500' },
    { name: 'Google', icon: 'mdi:google', color: 'bg-red-500' },
    { name: 'Twitter', icon: 'mdi:twitter', color: 'bg-blue-500' },
    { name: 'Facebook', icon: 'mdi:facebook', color: 'bg-blue-700' },
    { name: 'Instagram', icon: 'mdi:instagram', color: 'bg-pink-500' },
    { name: 'LinkedIn', icon: 'mdi:linkedin', color: 'bg-blue-800' },
    { name: 'YouTube', icon: 'mdi:youtube', color: 'bg-red-600' },
    { name: 'Slack', icon: 'mdi:slack', color: 'bg-purple-500' },
]);
</script>


<style scoped>
</style>
