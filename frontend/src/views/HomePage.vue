<script setup lang="ts">
import {ref } from 'vue';
import LogoComponent from '@/components/LogoComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';
import LoginButton from '@/components/LoginButton.vue';

const hover = ref(false);

</script>

<template>
    <div class="bg-[#4C4CDC] min-h-screen flex flex-col items-center justify-center relative text-white">
        <!-- Signup and login button -->
        <div class="w-full flex justify-end p-6 absolute top-0 right-0 space-x-6">
            <SignUpButton
                class="hover:cursor-pointer"
                :color="hover ? '#eee' : 'white'"
                @mouseover="hover = true"
                @mouseleave="hover = false" />
            <LoginButton
                class="hover:cursor-pointer"
                :color="hover ? '#eee' : 'white'"
                @mouseover="hover = true"
                @mouseleave="hover = false" />
        </div>

        <!-- Area lgo -->
        <div class="flex flex-col items-center justify-center mt-20">
            <LogoComponent color="#80C4E9" class="w-80 h-80 mb-10" />
        </div>

        <!-- About Us button -->
        <button 
            @click="() => $router.push('/aboutus')" 
            class="mt-10 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
            About Us
        </button>
    </div>
</template>

<style scoped>

</style>
