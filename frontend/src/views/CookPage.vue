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

        <div class="flex flex-col items-center justify-center min-h-screen py-16 mt-16 mobile:mt-32">
            <div class="cookies-page bg-home-div p-8 rounded-lg mobile:rounded-none shadow-lg text-white max-w-4xl">
                <h1 class="text-3xl mobile:text-2xl mobile:text-center font-bold mb-4">Cookies Policy</h1>
                <p class="mb-4">
                    Welcome to AREA's Cookies Policy page. This policy explains how we use cookies and similar technologies on our website.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">What Are Cookies?</h2>
                <p class="mb-4">
                    Cookies are small data files that are placed on your device or computer when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">How We Use Cookies</h2>
                <p class="mb-4">
                    We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry-standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Types of Cookies We Use</h2>
                <ul class="list-disc list-inside mb-4">
                    <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
                    <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</li>
                    <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                    <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.</li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Managing Cookies</h2>
                <p class="mb-4">
                    You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These settings are usually found in the 'options' or 'preferences' menu of your browser. To understand these settings, the following links may be helpful. Otherwise, you should use the 'Help' option in your browser for more details.
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li><a aria-label="Google Chrome" href="https://support.google.com/chrome/answer/95647?hl=en" class="text-blue-500 hover:underline">Google Chrome</a></li>
                    <li><a aria-label="Mozilla Firefox" href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" class="text-blue-500 hover:underline">Mozilla Firefox</a></li>
                    <li><a aria-label="Safari" href="https://support.apple.com/kb/PH21411?locale=en_US" class="text-blue-500 hover:underline">Safari</a></li>
                    <li><a aria-label="Internet Explorer" href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" class="text-blue-500 hover:underline">Internet Explorer</a></li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Changes to This Cookies Policy</h2>
                <p class="mb-4">
                    We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page. You are advised to review this Cookies Policy periodically for any changes. Changes to this Cookies Policy are effective when they are posted on this page.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Contact Us</h2>
                <p class="mb-4">
                    If you have any questions about this Cookies Policy, please contact us at <a aria-label="email-contact" href="mailto:contact.area.ownspace@gmail.com" class="text-blue-500 hover:underline">contact.area.ownspace@gmail.com</a>.
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