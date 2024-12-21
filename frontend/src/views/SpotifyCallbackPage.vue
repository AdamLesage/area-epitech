<template>
    <div>
        <p>Processing Spotify login...</p>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import { onMounted } from 'vue';

// Access the router
const router = useRouter();
const route = useRoute();

const { token, email } = route.query;

// Handle the callback
const handleSpotifyCallback = async () => {
    if (token && email) {
        // Save token and email in cookies
        const tokenString = token.toString();
        const emailString = email.toString();

        Cookies.set('token', tokenString);
        Cookies.set('email', emailString);

        // Redirect to the dashboard
        router.push('/dashboard');
    } else {
        console.error('Invalid Spotify callback data');
        console.error('Token:', token);
        console.error('Email:', email);
    }
};

// Run the handler when the component is mounted
onMounted(async () => {
    await handleSpotifyCallback();
});
</script>
