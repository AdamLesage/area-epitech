<template>
    <div class="bg-auth-primary flex web:justify-center items-center mobile:justify-between mobile:flex-col">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 big:hidden hover:cursor-pointer" @click="goToHomePage" />
        <div class="absolute top-0 w-full justify-center mobile:!hidden web:hidden big:flex">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary my-4 hover:cursor-pointer z-20" @click="goToHomePage">AREA</h1>
        </div>
        <SignUpButton
            class="hover:cursor-pointer absolute top-5 right-5 mobile:hidden"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4 hover:cursor-pointer" @click="goToHomePage">AREA</h1>
            <LoginFormComponent @submit="handleSubmit" />
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoginFormComponent from '@/components/LoginFormComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import axios from 'axios';
import Cookies from 'js-cookie'

import { LoginFormValues, User } from '@/types/auth';

const hover = ref(false);
const router = useRouter();

// Form submission handler
async function handleSubmit(values: LoginFormValues): Promise<void> {
    console.log('Login Form Received:', values);
    try {
        const res: { status: number, data: { user: User } } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            email: values.email,
            password: values.password,
        });
        console.log(res);
        if (res.status == 200) {
            console.log('User registered successfully');
            Cookies.set('token', res.data.user.authToken);
            router.push('/dashboard');
        } else {
            console.log('User registration failed');
        }
    } catch (error) {
        console.error('User registration failed:', error);
    }
};

// Go to home page
function goToHomePage() {
    router.push('/');
};

onMounted(async () => {
    const token = Cookies.get('token');
    if (token && token != '') {
        router.push('/dashboard');
    }
});
</script>

<style scoped>
</style>
