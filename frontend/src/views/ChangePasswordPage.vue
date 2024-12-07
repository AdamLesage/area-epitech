<script setup lang="ts">
import PasswordChangeFormComponent from '@/components/PasswordChangeFormComponent.vue';
import LogoComponent from '@/components/LogoComponent.vue';
import { PasswordChangeFormValues } from '@/types/auth';

// Form submission handler
const handleSubmit = (values: PasswordChangeFormValues) => {
    console.log('Password Change Form Received:', values);
};

// Abort button handler
const handleAbort = () => {
    console.log('User Aborted Email Verification');
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <PasswordChangeFormComponent
            @submit="handleSubmit"
            @abort="handleAbort" />
    </div>
</template>

<style scoped>
</style>
