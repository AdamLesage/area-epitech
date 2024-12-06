<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoginFormComponent from '@/components/LoginFormComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';
import { LoginFormValues } from '@/types/auth';

import { ref } from 'vue';

const signUpHover = ref(false);

// Form submission handler
const handleSubmit = (values: LoginFormValues) => {
    console.log('Login Form Received:', values);
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <LoginFormComponent @submit="handleSubmit" />
        <SignUpButton
            class="hover:cursor-pointer absolute top-5 right-5"
            :color="signUpHover ? '#eee' : 'white'"
            @mouseover="signUpHover = true"
            @mouseleave="signUpHover = false" />
    </div>
</template>

<style scoped>
</style>
