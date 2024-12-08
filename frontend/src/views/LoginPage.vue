<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoginFormComponent from '@/components/LoginFormComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';
import { LoginFormValues } from '@/types/auth';

import { onMounted, ref } from 'vue';
import { Capacitor } from '@capacitor/core';

const isMobile = ref(true);
const hover = ref(false);

// Form submission handler
const handleSubmit = (values: LoginFormValues) => {
    console.log('Login Form Received:', values);
};

onMounted(() => {
    if (Capacitor.getPlatform() == 'web')
        isMobile.value = false;
});
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center"
        v-if="!isMobile">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <LoginFormComponent @submit="handleSubmit" />
        <SignUpButton
            class="hover:cursor-pointer absolute top-5 right-5"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
    </div>
    <div class="bg-auth-primary flex justify-center items-center"
        v-else>
        <h1 class="text-3xl text-white">Login</h1>
        <h2 class="text-xl text-white">Mobile Login Coming Soon</h2>
    </div>
</template>

<style scoped>
</style>
