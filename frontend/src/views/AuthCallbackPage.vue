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
import { onMounted, ref } from 'vue';

// Access the router
const router = useRouter();
const route = useRoute();

function back() {
    router.push('/');
}

// Reactive reference for the token
const token = ref<string | null>(null);

// Handle the callback
const handleAuthCallback = async () => {
    if (token.value) {
        // Save token in cookies
        Cookies.set('token', token.value);
        console.log('Token saved:', token.value);

        // Wait for a bit for the token to be saved
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Redirect to the dashboard
        await router.push('/dashboard');
    } else {
        console.error('Invalid Auth callback data');
        back();
    }
};

// Watch for token changes or extract it on mounted
onMounted(async () => {
    // Extract token from route query
    const queryToken = route.query.token;

    if (typeof queryToken === 'string') {
        token.value = queryToken;
        await handleAuthCallback();
    } else {
        console.error('Token not found or invalid:', queryToken);
        back();
    }
});
</script>
