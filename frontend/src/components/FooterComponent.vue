<template>
    <footer class="flex justify-between items-center flex-col h-64 half:!h-fit py-8 mt-32 shrink-0" :style="{ backgroundColor: '#333' }">
        <h1 class="text-3xl font-black text-white text-center mb-8">CONTACT US</h1>
        <div class="flex half:flex-col w-full justify-center items-center px-8">
            <div class="flex gap-4 items-center w-full justify-center">
                <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-white" />
                <p class="text-white hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
            </div>
            <p class="w-full text-center text-white">Project made at Epitech</p>
            <div class="w-full flex justify-center">
                <h1 class="text-4xl font-black text-white text-center hover:cursor-pointer half:mt-12" @click="scrollToTop">AREA</h1>
            </div>
        </div>
        <div class="flex justify-center items-center gap-8 mt-8 text-white/60 text-sm mobile:mb-20">
            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/mentions')">Mentions</p>
            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/cookies')">Cookies</p>
            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/privacy')">Privacy</p>
            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/terms')">Terms</p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path: string) {
    router.push(path);
}

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
</script>
