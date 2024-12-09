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
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <PasswordRetrievalFormComponent
                email="test@gmail.com"
                @submit="handleSubmit"
                @abort="handleAbort"
                @send-again="handleSendAgain" />
        </div>
    </div>
</template>

<style scoped>
</style>
