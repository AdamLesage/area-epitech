<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>

        <!-- Processing Content -->
        <div class="flex flex-col items-center justify-center h-[100vh] z-[2]">
            <h1 class="text-5xl font-extrabold text-white mb-4">Processing Authentication</h1>
            <p class="text-xl text-home-text-light text-center mb-2 bg-home">
                You are currently under authentication process, please wait...
            </p>
            <p class="text-sm text-home-text-light mb-6 text-center">
                * If this takes too long, please contact an administrator or try login again.
            </p>
            <button @click="back" class="btn btn-primary px-12 py-4 text-white bg-home-div rounded-lg transition hover:cursor-pointer z-10">
                Back
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import { onMounted } from 'vue';

// Access the router
const router = useRouter();
const route = useRoute();

const { token } = route.query;

function back() {
    router.push('/');
}

// Handle the callback
const handleAuthCallback = async () => {
    if (token) {
        // Save token in cookies
        const tokenString = token.toString();

        Cookies.set('token', tokenString);

        // Redirect to the dashboard
        router.push('/dashboard');
    } else {
        console.error('Invalid Auth callback data');
        console.error('Token:', token);
    }
};

// Run the handler when the component is mounted
onMounted(async () => {
    await handleAuthCallback();
});
</script>
