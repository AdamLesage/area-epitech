<script setup lang="ts">
import SignUpFormComponent from '@/components/SignUpFormComponent.vue';
import LogoComponent from '@/components/LogoComponent.vue';
import LoginButton from '@/components/LoginButton.vue';
import { SignUpFormValues } from '@/types/auth';
import axios from 'axios';

import { ref } from 'vue';
import Cookies from 'js-cookie'

const hover = ref(false);

// Form submission handler
const handleSubmit = async (values: SignUpFormValues) => {
    console.log('Sign Up Form Received:', values);
    try {
        const res = await axios.post('http://localhost:8080/auth/register', {
            email: values.email,
            password: values.password,
            name: 'blabla',
            surname: 'tt',
        });
        console.log(res);
        if (res.status == 201) {
            console.log('User registered successfully');
            Cookies.set('token', res.data.authToken);
        } else {
            console.log('User registration failed');
        }
    } catch (error) {
        console.error('User registration failed:', error);
    }
};
</script>

<template>
    <div class="bg-auth-primary flex web:justify-center items-center mobile:justify-between mobile:flex-col">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <LoginButton
            class="hover:cursor-pointer absolute top-5 right-5 mobile:hidden"
            :color="hover ? '#eee' : 'white'"
            @mouseover="hover = true"
            @mouseleave="hover = false" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <SignUpFormComponent @submit="handleSubmit" />
        </div>
    </div>
</template>

<style scoped>
</style>
