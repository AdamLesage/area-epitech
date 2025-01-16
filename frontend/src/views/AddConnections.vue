<template>
    <div class="min-h-screen bg-home text-white font-sans flex justify-center items-center px-4 sm:px-8">
        <ServiceNavComponent @back-button="goBack" class="mobile:hidden z-10 absolute top-0" />
        <MobileServiceNavComponent @back-button="goBack" class="web:hidden fixed bottom-0 z-40" />
        <!-- Main container -->
        <div class="bg-home-div mobile:bg-transparent mobile:shadow-none rounded-xl p-6 sm:p-10 w-2/3 mobile:w-full max-w-[66.75rem] text-center shadow-2xl relative mobile:px-0">
            <div class="flex justify-center items-center mb-6 sm:mb-8">
                <h2 class="half:text-2xl text-4xl font-semibold tracking-wide">Add a new account</h2>
            </div>

            <!-- Responsive icons flexbox -->
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
                <button
                    v-for="platform in notConnectedServices"
                    :key="platform.name"
                    :style="{ backgroundColor: platform.color }"
                    @click="selectPlatform(platform.name)"
                    class="rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-white w-16 mobile:w-[3rem] h-16 mobile:h-[3rem]"
                    :aria-label="`Select ${platform.name}`"
                    role="button">
                    <Icon :icon="platform.icon" class="w-[3.5rem] mobile:w-[2.5rem] h-[3.5rem] mobile:h-[2.5rem] text-white" />
                </button>
            </div>
            <div class="flex items-center justify-center gap-4" v-if="notConnectedServices.length == 0">
                <Icon icon="akar-icons:check" class="mobile:text-2xl text-4xl text-green-500" />
                <h1 class="mobile:text-base text-lg font-semibold tracking-wide">No more platforms to connect to</h1>
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

import MobileServiceNavComponent from "@/components/MobileServiceNavComponent.vue";
import ServiceNavComponent from "@/components/ServiceNavComponent.vue";

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
    if (platformName == 'github' ||
        platformName == 'spotify' ||
        platformName == 'dropbox' ||
        platformName == 'discord' ||
        platformName == 'strava') {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${platformName}?email=${email}`;
    } else {
        if (platformName == 'gmail') {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google?email=${email}`;
            return;
        }
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
