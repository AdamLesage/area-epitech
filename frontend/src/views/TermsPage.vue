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
            <div class="terms-page bg-home-div p-8 rounded-lg shadow-lg text-white max-w-4xl">
                <h1 class="text-3xl font-bold mb-4">Terms and Conditions</h1>
                <p class="mb-4">
                    Welcome to AREA's Terms and Conditions page. Please read these terms carefully before using our website.
                </p>
                <h2 class="text-2xl font-bold mb-2">Acceptance of Terms</h2>
                <p class="mb-4">
                    By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <h2 class="text-2xl font-bold mb-2">Modification of Terms</h2>
                <p class="mb-4">
                    We reserve the right to change these terms at any time. We will notify you of any changes by posting the new Terms and Conditions on this page. You are advised to review these Terms and Conditions periodically for any changes. Changes to these Terms and Conditions are effective when they are posted on this page.
                </p>
                <h2 class="text-2xl font-bold mb-2">Use of the Website</h2>
                <p class="mb-4">
                    You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                </p>
                <h2 class="text-2xl font-bold mb-2">Intellectual Property</h2>
                <p class="mb-4">
                    All content included on the website, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the website, is the property of AREA or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.
                </p>
                <h2 class="text-2xl font-bold mb-2">Limitation of Liability</h2>
                <p class="mb-4">
                    In no event shall AREA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the website; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the website; (iv) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website by any third party; (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the website; and/or (vi) the defamatory, offensive, or illegal conduct of any third party.
                </p>
                <h2 class="text-2xl font-bold mb-2">Governing Law</h2>
                <p class="mb-4">
                    These terms shall be governed and construed in accordance with the laws of the country, without regard to its conflict of law provisions.
                </p>
                <h2 class="text-2xl font-bold mb-2">Contact Us</h2>
                <p class="mb-4">
                    If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:contact.area.ownspace@gmail.com" class="text-blue-500 hover:underline">contact.area.ownspace@gmail.com</a>.
                </p>
            </div>
        </div>

        <footer class="flex justify-between items-center flex-col h-64 bg-home-div py-8 relative z-[2]">
            <h1 class="text-3xl font-black text-home-text-light text-center mb-8">CONTACT US</h1>
            <div class="flex w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-home-text-light" />
                    <p class="text-home-text-light hover:cursor-pointer" @click="copyEmail">area.romainlemalin@gmail.com</p>
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