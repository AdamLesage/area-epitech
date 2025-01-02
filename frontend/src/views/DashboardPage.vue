<template>
    <div class="text-white font-sans h-screen bg-[#333] flex flex-col">
        <!-- Help Assistant Popup -->
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#333333" class="z-50" />

        <!-- Navbar -->
        <NavbarComponent />

        <!-- Main Content -->
        <div class="flex flex-col md:flex-row-reverse flex-1 overflow-hidden">
            <!-- Main Section -->
            <div class="flex-1 p-4 overflow-auto">
                <!-- Search Bar -->
                <SearchBarComponent class="mb-4 md:mb-0 py-4" />

                <!-- Suggestions and Explore -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <SuggestionsComponent class="mb-4 md:mb-0" />
                    <ExplorePlatformsComponent
                        :services="availableServices"
                        @click="handleServiceClick"
                        v-if="availableServices" />
                </div>
            </div>

            <!-- Sidebar: Updates -->
            <UpdatesSidebar :updates="updates" class="md:w-1/4 w-full overflow-auto" />
        </div>
    </div>
</template>

<script setup lang="ts">
import NavbarComponent from '../components/NavbarComponent.vue'; // Import the NavbarComponent
import UpdatesSidebar from '../components/UpdatesSidebar.vue'; // Import the UpdatesSidebar
import SearchBarComponent from '../components/SearchBarComponent.vue'; // Import the SearchBarComponent
import SuggestionsComponent from '../components/SuggestionsComponent.vue'; // Import the SuggestionsComponent
import ExplorePlatformsComponent from '../components/ExplorePlatformsComponent.vue'; // Import the ExplorePlatformsComponent
import HelpAssistantPopupComponent from '../components/HelpAssistantPopupComponent.vue'; // Import the HelpAssistantPopupComponent

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Service, Action, Reaction, ServiceDetails, Category } from '@/types/services'; // Import the Service type
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service'; // Import the useServiceStore function
import { useUserStore } from '@/stores/user';
import Cookies from 'js-cookie';
import { User } from '@/types/auth';

const serviceStore = useServiceStore(); // Use the useServiceStore function
const userStore = useUserStore();
const router = useRouter();

// updates infos
const updates = ref([
    { id: 1, content: '✅ Created Login Page' },
    { id: 2, content: '✅ Created Register Page' },
    { id: 3, content: '✅ Added User Info Page' },
    { id: 4, content: '✅ Finished Home Page' },
    { id: 5, content: '✅ Backend API Authentification' },
    { id: 6, content: '✅ Finished Service Page'},
    { id: 7, content: '✅ Finished My Area Page'},
    { id: 8, content: '✅ Added create AREA possibility'},
    { id: 9, content: '🚀 Ready For MVP'},
]);

function handleServiceClick(name: string) {
    console.log('Service clicked:', name);
    const service = availableServices.value.find(service => service.name === name);
    if (!service) {
        console.error('Service not found');
        return;
    }
    console.log('Service:', service);
    router.push(`/service/${service.name.toLowerCase()}`);
}

// Available services
const availableServices = ref<Service[]>([])

onMounted(async() => {
    availableServices.value = serviceStore.services;
})
</script>

<style scoped>
</style>
