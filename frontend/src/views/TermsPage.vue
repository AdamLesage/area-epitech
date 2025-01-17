<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#13134c" class="z-50" />
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>

        <!-- Navigation Bar -->
        <nav class="flex items-center w-full justify-between pl-8 pr-4 py-4 fixed bg-home z-10 mobile:flex-col">
            <div class="w-full h-[55px] items-center flex">
                <h1 class="w-1/2 mobile:w-full text-3xl font-black tracking-wide cursor-pointer text-home-text"
                    @click="navigateTo('/')">AREA</h1>
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start gap-4 -ml-3" v-if="!user">
                <LoginButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
                <SignUpButtonText
                    class="hover:cursor-pointer"
                    color="white"
                    text-color="#4C4CDC" />
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start -ml-3" v-else>
                <DashboardButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
            </div>
        </nav>

        <div class="flex flex-col items-center justify-center min-h-screen py-16 mt-16">
            <div class="terms-page bg-home-div p-8 mobile:rounded-none rounded-lg shadow-lg text-white max-w-4xl">
                <h1 class="text-3xl mobile:text-2xl mobile:text-center font-bold mb-4">Terms and Conditions</h1>
                <p class="mb-4">
                    Welcome to AREA's Terms and Conditions page. Please read these terms carefully before using our website.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Acceptance of Terms</h2>
                <p class="mb-4">
                    By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Modification of Terms</h2>
                <p class="mb-4">
                    We reserve the right to change these terms at any time. We will notify you of any changes by posting the new Terms and Conditions on this page. You are advised to review these Terms and Conditions periodically for any changes. Changes to these Terms and Conditions are effective when they are posted on this page.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Use of the Website</h2>
                <p class="mb-4">
                    You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Intellectual Property</h2>
                <p class="mb-4">
                    All content included on the website, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the website, is the property of AREA or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Limitation of Liability</h2>
                <p class="mb-4">
                    In no event shall AREA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the website; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the website; (iv) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website by any third party; (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the website; and/or (vi) the defamatory, offensive, or illegal conduct of any third party.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Governing Law</h2>
                <p class="mb-4">
                    These terms shall be governed and construed in accordance with the laws of the country, without regard to its conflict of law provisions.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Contact Us</h2>
                <p class="mb-4">
                    If you have any questions about these Terms and Conditions, please contact us at <a aria-label="send-a-mail-to-our-contact-email-terms" href="mailto:contact.area.ownspace@gmail.com" class="text-blue-500 hover:underline">contact.area.ownspace@gmail.com</a>.
                </p>
            </div>
        </div>
        <MobileServiceNavComponent @back-button="navigateTo('/')" class="web:hidden fixed bottom-0 bg-home-div z-[10000]" />

        <footer class="flex justify-between items-center flex-col h-64 half:!h-fit bg-home-div py-8 relative z-[2] mt-32 mobile:mt-16">
            <h1 class="text-3xl font-black text-home-text-light text-center mb-8">CONTACT US</h1>
            <div class="flex half:flex-col w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-home-text-light" />
                    <p class="text-home-text-light hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                </div>
                <p class="w-full text-center text-home-text-light">Project made at Epitech</p>
                <h1 class="text-4xl font-black text-home-text text-center w-full hover:cursor-pointer half:mt-12" @click="scrollToTop">AREA</h1>
            </div>
            <div class="flex justify-center items-center gap-8 mt-8 text-home-text-light text-sm mobile:mb-20">
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

import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import DashboardButtonText from '@/components/DashboardButtonText.vue';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const user = ref(userStore.user);

function navigateTo(route: string) {
    if (router) {
        window.scrollTo(0, 0);
        router.push(route);
        window.scrollTo(0, 0);
    } else {
        console.error('Router is not defined');
    }
};

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    user.value = userStore.user;
})
</script>