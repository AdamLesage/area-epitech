<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>
  
        <!-- Navigation Bar -->
        <nav class="flex items-center w-full justify-between px-8 py-4 fixed bg-home z-10">
            <h1 class="w-1/2 text-3xl font-black tracking-wide mb-4 md:mb-0 cursor-pointer text-home-text"
                @click="goHome">AREA</h1>
            <div class="w-1/2 flex justify-end gap-8">
                <LoginButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
                <SignUpButtonText
                    class="hover:cursor-pointer"
                    color="white"
                    text-color="#4C4CDC" />
            </div>
        </nav>
    
        <!-- Not Authorized Content -->
        <div class="flex flex-col items-center justify-center h-[100vh] z-[2]">
            <h1 class="text-5xl font-extrabold text-white mb-4">Not Authorized</h1>
            <p class="text-xl text-home-text-light text-center mb-2 bg-home">
                You are not authorized to view this page, please go back.
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

const router = useRouter();

function back() {
    router.go(-2);
}

function goHome() {
    router.push('/');
}
</script>
