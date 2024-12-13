<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
        <!-- Navbar -->
        <NavbarComponent />

        <div class="flex flex-col md:flex-row h-full">
            <!-- Sidebar: Updates -->
            <UpdatesSidebar :updates="updates" class="md:w-1/4 w-full" />

            <div class="flex-1 bg-gray-800 p-4">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import NavbarComponent from '../components/NavbarComponent.vue'; // Import the NavbarComponent
import UpdatesSidebar from '../components/UpdatesSidebar.vue'; // Import the UpdatesSidebar
import SearchBarComponent from '../components/SearchBarComponent.vue'; // Import the SearchBarComponent
import SuggestionsComponent from '../components/SuggestionsComponent.vue'; // Import the SuggestionsComponent
import ExplorePlatformsComponent from '../components/ExplorePlatformsComponent.vue'; // Import the ExplorePlatformsComponent

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Service, Action, Reaction, ServiceDetails } from '@/types/services'; // Import the Service type
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service'; // Import the useServiceStore function
import { useUserStore } from '@/stores/users';
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
    const email = Cookies.get('email');
    const token = Cookies.get('token');

    if (!email && !token) {
        console.error('Not logged in.');
        router.push('/');
        return;
    } else {
        const user = userStore.user;
        console.log(user);
        if (!user) {
            const res: { status: number, data: User } = await axios.get<User>(
                `${import.meta.env.VITE_BACKEND_URL}/api/user`,
                {
                    params: {
                        email: email,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res);
            if (res.status === 200) {
                console.log('User fetched successfully');
                userStore.setUser(res.data);
            } else {
                console.log('User fetching failed');
                router.push('/');
                Cookies.remove('email');
                Cookies.remove('token');
            }
        }
    }
    // Fetch the different services from the API
    console.log(import.meta.env.VITE_BACKEND_URL);
    const response: { status: number, data: { services: Service[] }} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/services-info.json`);
    console.log(response);
    if (response.status !== 200) {
        console.error('Error while fetching services');
        return;
    }
    availableServices.value = response.data.services;
    for (const service of availableServices.value) {
        serviceStore.setNewService(service);
        console.log('Service:', service, 'added to serviceStore:', serviceStore.services);
    }
    console.log(availableServices.value);
    // Getting all the services areas
    const response2: {
        status: number, data: { services: ServiceDetails[] }} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/services-areas.json`);
    console.log(response2);
    if (response2.status !== 200) {
        console.error('Error while fetching services areas');
        return;
    }
    for (const service of availableServices.value) {
        const serviceDetails = response2.data.services.find(s => s.name === service.name);
        if (!serviceDetails) {
            console.error('No service details found for service:', service.name);
            continue;
        }
        serviceStore.setServiceAreas(service.name, serviceDetails.actions, serviceDetails.reactions);
    }
})
</script>

<style scoped>
</style>
