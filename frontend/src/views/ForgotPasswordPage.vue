<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import PasswordRetrievalFormComponent from '@/components/PasswordRetrievalFormComponent.vue';
import { PasswordRetrievalFormValues } from '@/types/auth';

// Form submission handler
const handleSubmit = (values: PasswordRetrievalFormValues) => {
    console.log('Forgot Password Form Received:', values);
};

// Abort button handler
const handleAbort = () => {
    console.log('User Aborted Forgot Password Verification');
};

// Send again button handler
const handleSendAgain = () => {
    console.log('User requested to send email again');
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <PasswordRetrievalFormComponent
            email="test@gmail.com"
            @submit="handleSubmit"
            @abort="handleAbort"
            @send-again="handleSendAgain" />
    </div>
</template>

<style scoped>
</style>
