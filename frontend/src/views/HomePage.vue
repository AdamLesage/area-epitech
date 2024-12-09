<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';

const isMobile = ref(true);

onMounted(() => {
    if (Capacitor.getPlatform() == 'web')
        isMobile.value = false;
});
</script>

<template>
    <div class="bg-auth-primary"
        v-if="!isMobile">
        <h1 class="text-3xl text-white text-center">Web Home</h1>
        <nav class="flex gap-5">
            <router-link to="/login" class="hover:cursor-pointer" >Login</router-link>
            <router-link to="/signup" class="hover:cursor-pointer" >Sign Up</router-link>
            <router-link to="/forgot-password" class="hover:cursor-pointer" >Forgot Password</router-link>
            <router-link to="/email-verification" class="hover:cursor-pointer" >Email Verification</router-link>
            <router-link to="/dashboard" class="hover:cursor-pointer" >dashboard</router-link>

            
        </nav>
    </div>
    <div class="bg-auth-primary"
        v-else>
        <h1 class="text-3xl text-white text-center">Mobile Home</h1>
        <nav class="flex gap-5 flex-col">
            <router-link to="/login" class="hover:cursor-pointer" >Login</router-link>
            <router-link to="/signup" class="hover:cursor-pointer" >Sign Up</router-link>
            <router-link to="/signup/user-details" class="hover:cursor-pointer" >User Details</router-link>
            <router-link to="/forgot-password" class="hover:cursor-pointer" >Forgot Password</router-link>
            <router-link to="/change-password" class="hover:cursor-pointer" >Change Password</router-link>
            <router-link to="/email-verification" class="hover:cursor-pointer" >Email Verification</router-link>
            <router-link to="/dashboard" class="hover:cursor-pointer" >dashboard</router-link>
        </nav>
    </div>
</template>