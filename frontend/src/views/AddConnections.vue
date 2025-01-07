<template>
    <div class="min-h-screen bg-home text-white font-sans flex justify-center items-center px-4 sm:px-8">
        <!-- Main container -->
        <div class="bg-home-div rounded-xl p-6 sm:p-10 w-full max-w-3xl text-center shadow-2xl relative">
            <div class="flex justify-between items-center mb-6 sm:mb-8">
                <h2 class="text-2xl sm:text-4xl font-semibold tracking-wide">Add a new account</h2>
                <button 
                    @click="goBack" 
                    class="p-2 sm:p-3 md:p-4 bg-home-text text-white rounded-lg transition-all text-sm sm:text-lg md:text-xl hover:cursor-pointer" 
                    aria-label="Back to previous page"
                    role="button">
                    Back
                </button>
            </div>

            <!-- Responsive icons flexbox -->
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
                <button
                    v-for="platform in notConnectedServices"
                    :key="platform.name"
                    :style="{ backgroundColor: platform.color }"
                    @click="selectPlatform(platform.name)"
                    class="p-4 sm:p-6 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    :aria-label="`Select ${platform.name}`"
                    role="button">
                    <Icon :icon="platform.icon" class="text-3xl sm:text-4xl text-white" />
                </button>
            </div>
            <div class="flex items-center justify-center gap-4" v-if="notConnectedServices.length == 0">
                <Icon icon="akar-icons:check" class="text-3xl sm:text-4xl text-green-500" />
                <h1 class="text-lg sm:text-lg font-semibold tracking-wide">No more platforms to connect to</h1>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from 'vue-router';
import { useUserStore } from "@/stores/user";
import { useServiceStore } from "@/stores/service";
import { Service } from "@/types/services";
import { LinkedAccount } from "@/types/auth";

const userStore = useUserStore();
const serviceStore = useServiceStore();

const router = useRouter();

// List of platforms to connect to with their respective icons and colors
const services = ref<Service[]>(serviceStore.services);
const notConnectedServices = computed<Service[]>(() => {
    const user = userStore.user;
    if (!user) return [];
    const linkedAccounts: LinkedAccount[] = user.linkedAccounts;
    return services.value.filter(service => !linkedAccounts.some(account => account.serviceName === service.name));
});

// Function to select a platform
function selectPlatform(platformName: string) {
    const user = userStore.user
    if (!user) {
        console.error('User not found');
        return;
    }
    const email = user.email
    console.log(`Selected platform: ${platformName}`);
    if (platformName === 'github') {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github?email=${user.email}`;
    } else if (platformName === 'spotify') {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/spotify?email=${user.email}`;
    } else if (platformName === 'dropbox') {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/dropbox?email=${user.email}`;
    } else {
        console.error(`Platform ${platformName} not yet supported`);
    }
}

// Function to navigate back to the user info page
function goBack() {
    router.push('/userinfo');
}

onMounted(() => {
    if (!userStore.user) {
        router.push('/');
    }
});
</script>