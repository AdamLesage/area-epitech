<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>
  
        <!-- Navigation Bar -->
        <nav class="flex items-center w-full justify-between pl-8 pr-4 py-4 fixed bg-home z-10 mobile:flex-col">
            <div class="w-full h-[55px] items-center flex">
                <h1 class="w-1/2 mobile:w-full text-3xl font-black tracking-wide cursor-pointer text-home-text"
                    @click="goHome">AREA</h1>
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start gap-4 -ml-3" v-if="!user">
                <LoginButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
                <SignUpButtonText
                    class="hover:cursor-pointer"
                    color="white"
                    text-color="#4C4CDC" />
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start -ml-3" v-else>
                <DashboardButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
            </div>
        </nav>
    
        <!-- Not Found Content -->
        <div class="flex flex-col items-center justify-center h-[100vh] z-[2] px-4">
            <h1 class="text-5xl mobile:text-2xl font-extrabold text-white mb-4">Not Found</h1>
            <p class="text-xl mobile:text-lg text-home-text-light text-center mb-2 bg-home">
                The page you requested is either not existent or currently unavailable.
            </p>
            <p class="text-sm text-home-text-light mb-6 text-center">
                * If you believe this is an error, please contact an administrator.
            </p>
            <button @click="back" class="btn btn-primary px-12 py-4 text-white bg-home-div rounded-lg transition hover:cursor-pointer z-10">
                Back
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import LoginButtonText from '@/components/LoginButtonText.vue';
import SignUpButtonText from '@/components/SignUpButtonText.vue';
import DashboardButtonText from '@/components/DashboardButtonText.vue';

import { onMounted, ref } from 'vue';

import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const user = ref(userStore.user);

function back() {
    router.go(-1);
}

function goHome() {
    router.push('/');
}

onMounted(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    user.value = userStore.user;
})
</script>
