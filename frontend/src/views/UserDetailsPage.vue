<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import DetailsFormComponent from '@/components/DetailsFormComponent.vue';
import { DetailsFormValues } from '@/types/auth';

// Form submission handler
const handleSubmit = (values: DetailsFormValues) => {
    console.log('Login Form Received:', values);
};

// Skip button handler
const handleSkip = () => {
    console.log('User skipped profile details');
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5" />
        <DetailsFormComponent @submit="handleSubmit" @skip="handleSkip" />
    </div>
</template>

<style scoped>
</style>
