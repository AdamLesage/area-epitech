<template>
    <div class="text-white font-sans h-screen bg-[#333] flex flex-col">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#333333" class="z-50" />
        <NavbarComponent />

        <!-- Main Content -->
        <div class="flex flex-col md:flex-row-reverse flex-1 overflow-hidden">
            <div class="flex-1 p-4 overflow-auto">
                <SearchBarComponent class="mb-4 md:mb-0 py-4" />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <SuggestionsComponent class="mb-4 md:mb-0" />
                    <ExplorePlatformsComponent
                        :services="availableServices"
                        @click="handleServiceClick"
                        v-if="availableServices" />
                </div>
            </div>

            <UpdatesSidebar :updates="updates" class="md:w-1/4 w-full overflow-auto" />
        </div>
    </div>
</template>

<script setup lang="ts">
import NavbarComponent from '../components/NavbarComponent.vue';
import UpdatesSidebar from '../components/UpdatesSidebar.vue';
import SearchBarComponent from '../components/SearchBarComponent.vue';
import SuggestionsComponent from '../components/SuggestionsComponent.vue';
import ExplorePlatformsComponent from '../components/ExplorePlatformsComponent.vue';
import HelpAssistantPopupComponent from '../components/HelpAssistantPopupComponent.vue';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Service } from '@/types/services';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
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
