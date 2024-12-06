<template>
    <div class="container">
        <header>
            <h1>Sign Up</h1>
            <h2>Please enter your details to sign up.</h2>
        </header>
        <div class="flex-wrap">
            <!-- Auth API Buttons -->
            <button class="auth-button" @click="authWithGoogle">
                <Icon icon="flat-color-icons:google" class="w-8 h-8" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const authWithGoogle = () => {
    console.log('Authenticating with Google...');
};
</script>

<style scoped>
.auth-button {
    background-color: white;
    border: 2px solid #BCB9BF;
    width: 6.75rem;
    height: 3.25rem;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
