<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#13134c" class="z-[60]" />
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
            <div class="privacy-page bg-home-div mobile:rounded-none p-8 rounded-lg shadow-lg text-white max-w-4xl">
                <h1 class="text-3xl mobile:text-2xl mobile:text-center font-bold mb-4">Privacy Policy</h1>
                <p class="mb-4">
                    Welcome to AREA's Privacy Policy page. Your privacy is critically important to us.
                </p>
                <p class="mb-4">
                    It is AREA's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a aria-label="our-app-website-url" href="http://area-workspace.fr:8081/ " class="text-blue-500 hover:underline">http://area-workspace.fr:8081/ </a> (hereinafter, "us", "we", or "http://area-workspace.fr:8081/ "). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Information We Collect</h2>
                <p class="mb-4">
                    We only collect information about you if we have a reason to do so – for example, to provide our services, to communicate with you, or to make our services better.
                </p>
                <p class="mb-4">
                    The types of information we collect include:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, etc.</li>
                    <li><strong>Log Data:</strong> IP address, browser type, browser version, pages of our website that you visit, time and date of your visit, time spent on those pages, and other statistics.</li>
                    <li><strong>Cookies:</strong> Data files that are placed on your device or computer and often include an anonymous unique identifier.</li>
                    <li><strong>Usage Data:</strong> Information on how the service is accessed and used.</li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">How We Use Information</h2>
                <p class="mb-4">
                    We use the information we collect in various ways, including to:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li>Provide, operate, and maintain our website</li>
                    <li>Improve, personalize, and expand our website</li>
                    <li>Understand and analyze how you use our website</li>
                    <li>Develop new products, services, features, and functionality</li>
                    <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                    <li>Process your transactions</li>
                    <li>Find and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                    <li>Enforce our terms and conditions</li>
                    <li>Protect the rights, property, or safety of our users and the public</li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Sharing Information</h2>
                <p class="mb-4">
                    We do not share your personal information with anyone except to comply with the law, develop our products, or protect our rights.
                </p>
                <p class="mb-4">
                    We may share information with:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li>Service providers who help us operate our website, such as hosting providers, email delivery services, and payment processors.</li>
                    <li>Law enforcement or governmental agencies if required by law or to protect our legal rights.</li>
                    <li>Third parties in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Security of Your Information</h2>
                <p class="mb-4">
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Your Data Protection Rights</h2>
                <p class="mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li>The right to access – You have the right to request copies of your personal data.</li>
                    <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                    <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                    <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
                    <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                </ul>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Changes to This Privacy Policy</h2>
                <p class="mb-4">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
                <h2 class="text-2xl mobile:text-lg font-bold mb-2">Contact Us</h2>
                <p class="mb-4">
                    If you have any questions about this Privacy Policy, please contact us at <a aria-label="send-a-mail-to-our-contact-email" href="mailto:contact.area.ownspace@gmail.com" class="text-blue-500 hover:underline">contact.area.ownspace@gmail.com</a>.
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
