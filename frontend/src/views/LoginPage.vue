<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoginFormComponent from '@/components/LoginFormComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';
import { LoginFormValues, User } from '@/types/auth';

import { onMounted, ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/users'
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useUserStore();
const hover = ref(false);

// Form submission handler
const handleSubmit = async (values: LoginFormValues) => {
    console.log('Login Form Received:', values);
    try {
        const res: { status: number, data: { user: User } } = await axios.post('http://localhost:8080/auth/login', {
            email: values.email,
            password: values.password,
        });
        console.log(res);
        if (res.status == 200) {
            console.log('User registered successfully');
            Cookies.set('token', res.data.user.authToken);
            Cookies.set('email', values.email);
            store.setUser(res.data.user);
            router.push('/dashboard');
        } else {
            console.log('User registration failed');
        }
    } catch (error) {
        console.error('User registration failed:', error);
    }
};

onMounted(() => {
    const token = Cookies.get('token');
    if (token) {
        router.push('/dashboard');
    }
});
</script>

<template>
    <div class="bg-auth-primary flex web:justify-center items-center mobile:justify-between mobile:flex-col">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <SignUpButton
            class="hover:cursor-pointer absolute top-5 right-5 mobile:hidden"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <LoginFormComponent @submit="handleSubmit" />
        </div>
    </div>
</template>

<style scoped>
</style>
