<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

import LogoComponent from '@/components/LogoComponent.vue';
import SignUpButtonText from '@/components/SignUpButtonText.vue';
import LoginButtonText from '@/components/LoginButtonText.vue';
import IconsComponent from '@/components/IconsComponent.vue';
import ArrowComponentBottom from '@/components/ArrowComponentBottom.vue';
import ArrowComponentTop from '@/components/ArrowComponentTop.vue';
import ArrowComponentLeft from '@/components/ArrowComponentLeft.vue';
import ArrowComponentRight from '@/components/ArrowComponentRight.vue';
import TimelineComponent from '@/components/TimelineComponent.vue';
import RateComponent from '@/components/RateComponent.vue';

import { Service, ServiceDetails } from '@/types/services';
import { useServiceStore } from '@/stores/service';

import axios from 'axios';
import UserSvgComponent from '@/components/UserSvgComponent.vue';

const router = useRouter();
const scrollY = ref(0);
const serviceStore = useServiceStore();
const userReview = ref('');
const userRate = ref(1);

function sendReview() {
    console.log('Review:', userReview.value, 'Rate:', userRate.value);
    userReview.value = '';
    userRate.value = 0;
}

const navigateTo = (route: string) => {
    if (router) {
        router.push(route);
    } else {
        console.error('Router is not defined');
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const scrollToAboutUs = () => {
    const aboutUs = document.getElementById('about-us');
    if (aboutUs) {
        aboutUs.scrollIntoView({ behavior: 'smooth' });
    }
};

const scrollToServices = () => {
    const services = document.getElementById('services');
    if (services) {
        services.scrollIntoView({ behavior: 'smooth' });
    }
};

const scrollToReviews = () => {
    const reviews = document.getElementById('reviews');
    if (reviews) {
        reviews.scrollIntoView({ behavior: 'smooth' });
    }
};

const scrollToHigher = () => {
    window.scrollTo({
        top: scrollY.value - 100,
        behavior: 'smooth'
    });
};

const scrollToLower = () => {
    window.scrollTo({
        top: scrollY.value + 100,
        behavior: 'smooth'
    });
};

const currentStep = ref(0);
window.addEventListener('scroll', () => {
    const aboutUs = document.getElementById('about-us');
    const services = document.getElementById('services');
    const reviews = document.getElementById('reviews');
    scrollY.value = window.scrollY;

    // Check if we go pass one of theses sections
    if (aboutUs && window.scrollY >= aboutUs.offsetTop && services && window.scrollY < services?.offsetTop) {
        currentStep.value = 1;
    } else if (services && window.scrollY >= services.offsetTop && reviews && window.scrollY < reviews?.offsetTop) {
        currentStep.value = 2;
    } else if (reviews && window.scrollY >= reviews.offsetTop) {
        currentStep.value = 3;
    } else {
        currentStep.value = 0;
    }
});

// Available services
const availableServices = ref<Service[]>([])
const serviceIdx = ref(0);

const computedServices = computed(() => {
    const numServicesToShow = 5;
    const totalServices = availableServices.value.length;
    const serviceIdxVal = Math.abs(serviceIdx.value);
    
    if (totalServices === 0) return [];

    const startIdx = (serviceIdxVal + totalServices) % totalServices;

    const services = [];
    for (let i = 0; i < numServicesToShow; i++) {
        services.push(availableServices.value[(startIdx + i) % totalServices]);
    }
    return services;
});

function handleServiceClick(name: string) {
    console.log('Service clicked:', name);
    const service = availableServices.value.find(service => service.name === name);
    if (!service) {
        console.error('Service not found');
        return;
    }
    console.log('Service:', service);
    router.push(`/service/${service.name.toLowerCase()}`);
}

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

onMounted(async() => {
    const aboutUs = document.getElementById('about-us');
    const services = document.getElementById('services');
    const reviews = document.getElementById('reviews');
    scrollY.value = window.scrollY;

    // Check if we go pass one of theses sections
    if (aboutUs && window.scrollY >= aboutUs.offsetTop && services && window.scrollY < services?.offsetTop) {
        currentStep.value = 1;
    } else if (services && window.scrollY >= services.offsetTop && reviews && window.scrollY < reviews?.offsetTop) {
        currentStep.value = 2;
    } else if (reviews && window.scrollY >= reviews.offsetTop) {
        currentStep.value = 3;
    } else {
        currentStep.value = 0;
    }
    // Fetch the different services from the API
    console.log(import.meta.env.VITE_BACKEND_URL);
    const response: { status: number, data: { services: Service[] }} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/services-info.json`);
    console.log(response);
    if (response.status !== 200) {
        console.error('Error while fetching services');
        return;
    }
    availableServices.value = response.data.services;
    for (const service of availableServices.value) {
        serviceStore.setNewService(service);
        console.log('Service:', service, 'added to serviceStore:', serviceStore.services);
    }
    console.log(availableServices.value);
})
</script>

<template>
    <div class="bg-home !h-full">
        <!-- Signup and login button -->
        <nav class="flex items-center w-full justify-between px-8 py-4 fixed bg-home z-10">
            <h1 class="w-full text-3xl font-black tracking-wide mb-4 md:mb-0 cursor-pointer text-home-text" @click="scrollToTop">AREA</h1>
            <div class="w-full flex gap-12 items-center justify-center text-home-text">
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer" @click="scrollToAboutUs">About us</h1>
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer" @click="scrollToServices">Services</h1>
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer" @click="scrollToReviews">Reviews</h1>
            </div>
            <div class="w-full flex justify-end gap-8">
                <LoginButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
                <SignUpButtonText
                    class="hover:cursor-pointer"
                    color="white"
                    text-color="#4C4CDC" />
            </div>
        </nav>

        <!-- Area logo -->
        <div class="flex flex-col items-center justify-center h-[100vh]">
            <LogoComponent color="#4C4CDC" class="w-80 h-80 mb-10" />
            <Icon icon="material-symbols:copyright-outline" class="absolute text-home-text w-6 h-6 mt-[-18rem] mr-[-19rem] z-0" />
        </div>
        <div class="fixed w-full flex justify-center items-center">
            <ArrowComponentBottom color="#4C4CDC" class="fixed bottom-4 text-center hover:cursor-pointer" v-if="scrollY == 0" @click="scrollToAboutUs" :animate="true" />
        </div>

        <!-- About us -->
        <div id="about-us" class="flex flex-col items-center">
            <section class="flex justify-center gap-16 items-center">
                <div class="flex flex-col gap-4 justify-center w-full">
                    <h2 class="text-2xl font-bold text-home-text mb-4 pt-24"><span class="text-home-light hover:cursor-pointer" @click="scrollToAboutUs">#</span> ABOUT US</h2>
                    <p class="text-lg leading-6 text-home-text-light w-[50rem]">
                        We are a team of 5 developers currently in Tek3 at Epitech, working on an exciting project called
                        <strong>AREA</strong> (Automated Reactive Event Application).
                        <br><br>
                        AREA is a web application designed to perform automated actions triggered by user-defined events.
                        Our stack includes Express.js for the backend and Vue.js for the frontend, allowing us to build a
                        dynamic and responsive system.
                        <br><br>
                        We have a timeline of 9 weeks to bring this project to life and make it a success!
                    </p>
                </div>
                <IconsComponent class="pt-24 mb-[-4rem]"/>
            </section>
            <section class="mt-8 w-full flex flex-col items-center justify-center">
                <TimelineComponent />
            </section>
            <!-- Who's -->
            <section class="w-full flex justify-center flex-col gap-8 items-center mt-8">
                <div class="flex flex-wrap w-11/12 gap-8 justify-center">
                    <!-- Team Cards -->
                    <div
                        class="bg-home-div w-1/4 rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:cursor-pointer">
                        <h3 class="font-bold text-home-text-light text-xl">Adam Lesage</h3>
                        <p class="text-sm text-gray-300 mt-2">Scrum Master<br>Ensures the project stays on track and
                            meets its goals.</p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:cursor-pointer">
                        <h3 class="font-bold text-home-text-light text-xl">Mathieu Mazeau</h3>
                        <p class="text-sm text-gray-300 mt-2">Front Developer and Designer<br>Creates and optimizes the front-end
                            experience.</p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:cursor-pointer">
                        <h3 class="font-bold text-home-text-light text-xl">Romain Chevallier</h3>
                        <p class="text-sm text-gray-300 mt-2">DevOps Engineer<br>Handles backend systems and automation.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:cursor-pointer">
                        <h3 class="font-bold text-home-text-light text-xl">Victor Hritsea</h3>
                        <p class="text-sm text-gray-300 mt-2">Backend Developer<br>Builds and manages the API backend.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:cursor-pointer">
                        <h3 class="font-bold text-home-text-light text-xl">Tugdual de Reviers</h3>
                        <p class="text-sm text-gray-300 mt-2">Front Developer<br>Creates and optimizes the front-end
                            experience.</p>
                    </div>
                </div>
            </section>
        </div>

        <div id="services" class="flex flex-col items-center">
            <h2 class="text-2xl font-bold text-home-text mb-12 pt-24"><span class="text-home-light hover:cursor-pointer" @click="scrollToServices">#</span> SERVICES</h2>
            <div class="flex gap-16 flex-wrap w-full justify-center">
                <div class="flex items-center h-48 justify-center">
                    <ArrowComponentLeft :animate="false" color="#4C4CDC" class="text-center hover:cursor-pointer" @click="serviceIdx--"/>
                </div>
                <div
                    v-for="(service) in computedServices.slice(0, 3)"
                    :key="service.name"
                    class="flex flex-col items-center p-4 rounded-md w-[20rem] h-48 justify-between"
                    :style="{ backgroundColor: service.color }"
                    :aria-label="`Explore ${service.name}`"
                    role="button"
                    tabindex="0"
                    @click="handleServiceClick(service.name)">
                    <Icon :icon="service.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                    <span class="text-lg font-medium text-white">{{ service.name }}</span>
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" textcolor="white" color="white" />
                </div>
                <div class="flex items-center h-48 justify-center">
                    <ArrowComponentRight :animate="false" color="#4C4CDC" class="text-center hover:cursor-pointer" @click="serviceIdx++"/>
                </div>
            </div>
            <button class="w-48 h-12 bg-home-div text-white rounded-lg mt-8 hover:cursor-pointer hover:bg-home-hover border-2 border-solid border-home-light" @click="navigateTo('/')">Explore all services</button>
        </div>

        <div id="reviews" class="flex flex-col items-center justify-center mt-12 mb-80">
            <section class="flex justify-center gap-4 items-center h-[360px]">
                <div class="flex flex-col gap-4 justify-center w-full">
                    <h2 class="text-2xl font-bold text-home-text mb-4 pt-24"><span class="text-home-light hover:cursor-pointer" @click="scrollToReviews">#</span> REVIEWS</h2>
                    <p class="text-lg leading-6 text-home-text-light w-[50rem]">
                        "I love AREA! It's so easy to use and it makes my life so much easier. I can't imagine my life without it now." <span class="text-home-text">@anonymous</span>
                        <br><br>
                        "AREA is a game changer! I've been using it for a few weeks now and I'm already seeing the benefits. I highly recommend it." <span class="text-home-text">@anonymous</span>
                        <br><br>
                        "AREA is amazing! It's so simple to set up and it works like a charm. I'm so glad I found it." <span class="text-home-text">@anonymous</span>
                    </p>
                </div>
                <div
                    class="flex flex-col items-center p-4 gap-4 rounded-lg justify-between bg-home-div w-full mt-32">
                    <div class="flex w-full items-center gap-4">
                        <UserSvgComponent color="#373799" />
                        <h2 class="text-home-text-light pr-4">What do you think of our website ?</h2>
                    </div>
                    <textarea class="w-full h-24 p-2 rounded-lg bg-gray-200 text-home max-h-36 min-h-12" placeholder="Enter your review" v-model="userReview" />
                    <div class="flex items-center justify-start -space-x-1">
                        <Icon
                            icon="material-symbols:star"
                            class="w-6 h-6 text-gray-100 hover:cursor-pointer"
                            v-for="index in userRate"
                            :key="'filled-' + index"
                            @click="userRate = index"
                        />
                        <Icon
                            icon="material-symbols:star-outline"
                            class="w-6 h-6 text-gray-100 hover:cursor-pointer"
                            v-for="index in (5 - userRate)"
                            :key="'empty-' + index"
                            @click="userRate = index + userRate"
                        />
                    </div>
                    <button class="w-48 h-12 bg-home-light text-white rounded-lg mt-4 hover:cursor-pointer" @click="sendReview">Add a review</button>
                </div>
            </section>
        </div>

        <footer class="flex justify-between items-center flex-col h-64 bg-home-div py-8">
            <h1 class="text-3xl font-black text-home-text-light text-center mb-8">CONTACT US</h1>
            <div class="flex w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-home-text-light" />
                    <p class="text-home-text-light hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                </div>
                <p class="w-full text-center text-home-text-light">Project made under Epitech © PGE program</p>
                <h1 class="text-4xl font-black text-home-text text-center w-full hover:cursor-pointer" @click="scrollToTop">AREA</h1>
            </div>
            <div class="flex justify-center items-center gap-8 mt-8 text-home-text-light text-sm">
                <p class="hover:underline hover:cursor-pointer">Mentions</p>
                <p class="hover:underline hover:cursor-pointer">Cookies</p>
                <p class="hover:underline hover:cursor-pointer">Privacy</p>
                <p class="hover:underline hover:cursor-pointer">Terms</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
</style>
