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
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <PasswordChangeFormComponent
                @submit="handleSubmit"
                @abort="handleAbort" />
        </div>
    </div>
</template>

<style scoped>
</style>
