<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#13134c" class="z-50" />
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>
        <nav class="flex items-center w-full justify-between px-8 py-4 fixed bg-home z-10">
            <h1 class="w-1/2 text-3xl font-black tracking-wide mb-4 md:mb-0 cursor-pointer text-home-text" @click="navigateTo('/')">AREA</h1>
            <div class="w-1/2 flex justify-end gap-8">
                <LoginButtonText class="hover:cursor-pointer" color="#4C4CDC" text-color="white" />
                <SignUpButtonText class="hover:cursor-pointer" color="white" text-color="#4C4CDC" />
            </div>
        </nav>

        <div class="flex flex-col items-center justify-center min-h-screen py-16">
            <div class="mentions-page bg-home-div p-8 rounded-lg shadow-lg text-white max-w-4xl">
                <h1 class="text-3xl font-bold mb-4">Legal Mentions</h1>
                <p class="mb-4">
                    Welcome to AREA's Legal Mentions page. Here you will find all the legal information about our website.
                </p>
                <h2 class="text-2xl font-bold mb-2">Website Publisher</h2>
                <p class="mb-4">
                    The website <a href="http://area-workspace.fr:8081/" class="text-blue-500 hover:underline">http://area-workspace.fr:8081/</a> is published by AREA, a company registered under the laws of France.
                </p>
                <h2 class="text-2xl font-bold mb-2">Contact Information</h2>
                <p class="mb-4">
                    You can contact us at <a href="mailto:area.romainlemalin@gmail.com" class="text-blue-500 hover:underline">area.romainlemalin@gmail.com</a>.
                </p>
                <h2 class="text-2xl font-bold mb-2">Hosting Provider</h2>
                <p class="mb-4">
                    The website is hosted by AWS, located at Nantes.
                </p>
                <h2 class="text-2xl font-bold mb-2">Intellectual Property</h2>
                <p class="mb-4">
                    All content on this website, including text, graphics, logos, icons, and images, is the property of AREA or its content suppliers and is protected by international copyright laws.
                </p>
                <h2 class="text-2xl font-bold mb-2">Limitation of Liability</h2>
                <p class="mb-4">
                    AREA will not be liable for any damages arising out of or in connection with the use of this website. This is a comprehensive limitation of liability that applies to all damages of any kind.
                </p>
                <h2 class="text-2xl font-bold mb-2">Governing Law</h2>
                <p class="mb-4">
                    These terms and conditions are governed by and construed in accordance with the laws of France. You agree to submit to the exclusive jurisdiction of the courts located in France for the resolution of any disputes.
                </p>
            </div>
        </div>

        <footer class="flex justify-between items-center flex-col h-64 bg-home-div py-8 relative z-[2]">
            <h1 class="text-3xl font-black text-home-text-light text-center mb-8">CONTACT US</h1>
            <div class="flex w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-home-text-light" />
                    <p class="text-home-text-light hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                </div>
                <p class="w-full text-center text-home-text-light">Project made under Epitech © PGE program</p>
                <h1 class="text-4xl font-black text-home-text text-center w-full hover:cursor-pointer" @click="navigateTo('/')">AREA</h1>
            </div>
            <div class="flex justify-center items-center gap-8 mt-8 text-home-text-light text-sm">
                <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/mentions')">Mentions</p>
                <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/cookies')">Cookies</p>
                <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/privacy')">Privacy</p>
                <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/terms')">Terms</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import LoginButtonText from '@/components/LoginButtonText.vue';
import SignUpButtonText from '@/components/SignUpButtonText.vue';

const router = useRouter();

function navigateTo(route: string) {
    router.push(route);
}

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}
</script>