<template>
    <div
        class="flex flex-col justify-center items-center min-h-screen bg-home font-sans text-white">
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10 absolute top-0" />
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden fixed bottom-0 z-40" />
        <div
            class="bg-home-div mobile:bg-transparent rounded-xl mobile:p-4 p-10 mobile:w-full w-2/3 max-w-[66.75rem] text-center shadow-2xl mobile:shadow-none mt-20 mobile:mt-0"
            v-if="user">

            <!-- PFP -->
            <img
                :src="(user.profilePicture == null) ? '/images/temppfp.jpeg' : user.profilePicture.url"
                alt="Profile Picture"
                class="w-48 h-48 mini:w-24 mini:h-24 rounded-full mb-6 border-4 mobile:border-2 border-white/70 mx-auto shadow-lg" />

            <!-- Username and creation date -->
            <h2 class="mobile:text-xl text-4xl font-semibold tracking-wide mb-2">{{ user.name }}</h2>
            <p class="mobile:text-xs text-sm text-gray-400 font-light">{{ user.bio }}</p>

            <!-- Actions -->
            <div class="flex flex-row justify-center items-center mt-8 mobile:mt-6 gap-8 mobile:gap-4 text-center text-gray-300">
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions Created</p>
                </div>
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive == true).length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions <span class="text-green-500">On</span></p>
                </div>
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive == false).length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions <span class="text-red-500">Off</span></p>
                </div>
            </div>

            <!-- Connected Platforms -->
            <div class="mobile:!mt-6 mt-12">
                <h3 class="mobile:!text-base text-2xl font-semibold mobile:mb-4 mb-6 tracking-wide">Connected Platforms</h3>
                <ConnectedApiIcons :platforms="detailedPlatforms ?? []" @socialClick="handleSocialClick" />
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 justify-center items-center w-full">
                <button
                    @click="goToAddConnections"
                    class="mobile:mt-6 mt-8 mobile:px-4 px-6 py-3 mobile:py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg mobile:text-sm text-white font-bold tracking-wide">
                    Add Connections
                </button>
                <button
                    @click="logout"
                    class="mobile:mt-6 mt-8 mobile:px-4 px-6 py-3 mobile:py-2 bg-red-600 hover:bg-red-700 rounded-full shadow-lg mobile:text-sm text-white font-bold tracking-wide">
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ConnectedApiIcons from "../components/ConnectedApiIcons.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useServiceStore } from "@/stores/service";
import Cookies from 'js-cookie';

import ServiceNavComponent from "@/components/ServiceNavComponent.vue";
import MobileServiceNavComponent from "@/components/MobileServiceNavComponent.vue";

const userStore = useUserStore();
const servicesStore = useServiceStore();
const router = useRouter();

// User Info
const user = ref(userStore.user);

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
});

function handleBackButton() {
    router.push('/dashboard');
}

function logout() {
    userStore.setUser(null);
    Cookies.remove('token');
    router.push('/');
}

interface Platform {
    name: string;
    color: string;
    icon: string;
}

// Computed Properties for ConnectedApiIcons
const detailedPlatforms = computed<Platform[]>(() => {
    if (!user.value?.linkedAccounts) return [];

    return user.value.linkedAccounts
        .map((linkedService) => {
        const service = servicesStore.services.find((s) => s.name === linkedService.serviceName);
        if (!service) return null;

        return {
            name: service.name,
            color: service.color,
            icon: service.icon,
        };
    }).filter((service): service is Platform => service !== null);
});

// Functions for ConnectedApiIcons
function handleSocialClick(platformName: string) {
    console.log(`Connect with ${platformName}`);
}

// Navigation to Add Connections
function goToAddConnections() {
    router.push("/add-connections");
}
</script>
