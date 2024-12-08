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
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <SignUpButton
            class="hover:cursor-pointer absolute top-5 right-5 mobile:hidden"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
        <div class="flex flex-col items-center z-10 justify-between">
            <h1 class="text-[4rem] font-black text-auth-secondary web:hidden">AREA</h1>
            <LoginFormComponent @submit="handleSubmit" />
        </div>
    </div>
    <div class="bg-auth-primary flex flex-col justify-between items-center"
        v-else>
        <h1 class="text-[4rem] font-black text-auth-secondary">AREA</h1>
        <LoginFormComponent @submit="handleSubmit" />
    </div>
</template>

<style scoped>
</style>
