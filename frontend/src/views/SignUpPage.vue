<script setup lang="ts">
import SignUpFormComponent from '@/components/SignUpFormComponent.vue';
import LogoComponent from '@/components/LogoComponent.vue';
import LoginButton from '@/components/LoginButton.vue';
import { SignUpFormValues } from '@/types/auth';

import { ref } from 'vue';

const hover = ref(false);

// Form submission handler
const handleSubmit = (values: SignUpFormValues) => {
    console.log('Sign Up Form Received:', values);
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <SignUpFormComponent @submit="handleSubmit" />
        <LoginButton
            class="hover:cursor-pointer absolute top-5 right-5"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
    </div>
</template>

<style scoped>
</style>
