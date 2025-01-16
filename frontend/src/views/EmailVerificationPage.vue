<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 big:hidden" />
        <div class="absolute top-0 w-full justify-center mobile:!hidden web:hidden big:flex">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary my-4 hover:cursor-pointer z-20" @click="redirectToHomePage">AREA</h1>
        </div>
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <EmailVerificationFormComponent
                email=""
                @submit="handleSubmit"
                @abort="handleAbort"
                @send-again="handleSendAgain" />
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import EmailVerificationFormComponent from '@/components/EmailVerificationFormComponent.vue';
import { EmailVerificationFormValues } from '@/types/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

function redirectToHomePage() {
    console.log('Redirecting to Home Page');
    router.push('/');
};

// Form submission handler
function handleSubmit(values: EmailVerificationFormValues) {
    console.log('Email Verification Form Received:', values);
};

// Abort button handler
function handleAbort() {
    console.log('User Aborted Email Verification');
    router.push('/userinfo');
};

// Send again button handler
function handleSendAgain() {
    console.log('User requested to send email again');
};

</script>
