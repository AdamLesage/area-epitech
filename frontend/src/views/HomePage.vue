<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#13134c" class="z-50" />
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>
        <!-- Signup and login button -->
        <button class="fixed bottom-4 right-4 z-[100] w-12 h-12 bg-home-div text-white rounded-full hover:cursor-pointer hover:bg-home-hover" v-if="scrollY != 0">
            <ArrowComponent
                direction="top"
                color="#4C4CDC"
                :animate="false"
                class="text-center"
                @click="scrollToTop" />
        </button>
        <nav class="flex half:flex-col items-center w-full justify-between pl-8 pr-4 py-4 fixed bg-home z-10">
            <div class="flex mobile:flex-col items-center justify-between w-full">
                <div class="w-1/2 mobile:w-full flex justify-between items-center h-[55px]">
                    <h1 class="w-1/2 mobile:w-full text-3xl font-black tracking-wide items-center cursor-pointer text-home-text" @click="scrollToTop">AREA</h1>
                    <div class="w-12 h-12 relative">
                        <Icon icon="mdi:menu" class="absolute top-0 mobile:mr-4 -right-6 mobile:right-0 w-12 h-12 p-2 bg-home-text rounded-full justify-center items-center text-home-text-light cursor-pointer hidden half:flex flex-shrink-0"
                        @click="showMenu = !showMenu" />
                    </div>
                </div>
                <div class="w-full flex gap-12 items-center justify-center text-home-text half:hidden">
                    <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToAboutUs">About us</h1>
                    <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToHowItWorks">How</h1>
                    <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToServices">Services</h1>
                    <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToReviews">Reviews</h1>
                </div>
                <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start gap-4" v-if="!user">
                    <LoginButtonText
                        class="hover:cursor-pointer"
                        color="#4C4CDC"
                        text-color="white" />
                    <SignUpButtonText
                        class="hover:cursor-pointer"
                        color="white"
                        text-color="#4C4CDC" />
                </div>
                <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start" v-else>
                    <DashboardButtonText
                        class="hover:cursor-pointer"
                        color="#4C4CDC"
                        text-color="white" />
                </div>
            </div>
            <div v-if="showMenu" class="mt-6 text-home-text text-xl hidden half:flex flex-col items-center">
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToAboutUs">About us</h1>
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToHowItWorks">How</h1>
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToServices">Services</h1>
                <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2" @click="scrollToReviews">Reviews</h1>
            </div>
        </nav>

        <!-- Area logo -->
        <div class="flex flex-col items-center justify-center h-[100vh]"
            :class="{ 'mt-20': showMenu }">
            <LogoComponent color="#4C4CDC" class="w-80 h-80 mb-10 z-[2]" />
            <Icon icon="material-symbols:copyright-outline" class="absolute text-home-text w-6 h-6 mt-[-18rem] mr-[-19rem] z-[2]" />
        </div>
        <div class="fixed w-full flex justify-center items-center bottom-6">
            <ArrowComponent
                direction="bottom"
                color="#4C4CDC"
                :animate="true"
                class="fixed bottom-4 text-center hover:cursor-pointer"
                v-if="scrollY == 0"
                @click="scrollToAboutUs" />
        </div>

        <!-- About us -->
        <div id="about-us" class="flex flex-col items-center mobile:!pt-32 half:pt-20">
            <section class="flex items-center w-full justify-center px-8 gap-8 mobile:flex-col">
                <div class="flex flex-col gap-4 justify-center w-fit">
                    <h2 class="text-2xl font-bold text-home-text mb-4 pt-24 z-[2]"><span class="text-home-light hover:cursor-pointer" @click="scrollToAboutUs">#</span> ABOUT US</h2>
                    <p class="text-lg leading-6 text-home-text-light w-full z-[2] max-w-[50rem]">
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
                <div class="flex justify-center items-center mobile:w-full w-fit">
                    <IconsComponent class="web:pt-20 mobile:pt-4 mobile:!w-full mb-[-4rem] !w-fit"/>
                </div>
            </section>
            <section class="mt-12 mb-4 w-full flex flex-col items-center justify-center">
                <TimelineComponent class="mini:scale-75 mobile:mt-24 mini:mt-12" />
            </section>
            <!-- Who's -->
            <section class="w-full flex justify-center flex-col gap-8 items-center web:mt-16 mobile:mt-4">
                <div class="flex flex-wrap w-full px-8 gap-8 justify-center">
                    <!-- Team Cards -->
                    <div
                        class="bg-home-div w-1/4 max-w-[20rem] min-w-[15rem] rounded-2xl p-6 text-center shadow-lg transform transition duration-500">
                        <h3 class="font-bold text-home-text-light text-xl">Adam Lesage</h3>
                        <p class="text-sm text-gray-300 mt-2">
                            Scrum Master<br>Ensures the project stays on track and meets its goals.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 max-w-[20rem] min-w-[15rem] rounded-2xl p-6 text-center shadow-lg transform transition duration-500">
                        <h3 class="font-bold text-home-text-light text-xl">Mathieu Mazeau</h3>
                        <p class="text-sm text-gray-300 mt-2">
                            Front Developer and Designer<br>Creates and optimizes the front-end experience.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 max-w-[20rem] min-w-[15rem] rounded-2xl p-6 text-center shadow-lg transform transition duration-500">
                        <h3 class="font-bold text-home-text-light text-xl">Romain Chevallier</h3>
                        <p class="text-sm text-gray-300 mt-2">
                            DevOps Engineer<br>Handles backend systems and automation.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 max-w-[20rem] min-w-[15rem] rounded-2xl p-6 text-center shadow-lg transform transition duration-500">
                        <h3 class="font-bold text-home-text-light text-xl">Victor Hritsea</h3>
                        <p class="text-sm text-gray-300 mt-2">
                            Backend Developer<br>Builds and manages the API backend.
                        </p>
                    </div>

                    <div
                        class="bg-home-div w-1/4 max-w-[20rem] min-w-[15rem] rounded-2xl p-6 text-center shadow-lg transform transition duration-500">
                        <h3 class="font-bold text-home-text-light text-xl">Tugdual de Reviers</h3>
                        <p class="text-sm text-gray-300 mt-2">
                            Front Developer<br>Creates and optimizes the front-end experience.
                        </p>
                    </div>
                </div>
            </section>
        </div>

        <!-- How It Works -->
        <div id="how-it-works" class="flex flex-col items-center mobile:!pt-28 half:pt-24 pt-24">
            <h2 class="text-2xl font-bold text-home-text mb-8 z-[2] mobile:!pt-28 half:pt-24">
                <span class="text-home-light hover:cursor-pointer" @click="scrollToHowItWorks">#</span> HOW IT WORKS
            </h2>
            <div class="flex gap-8 flex-wrap justify-center w-full max-w-5xl text-center">
                <div class="flex flex-col items-center w-1/3 min-w-[15rem]">
                    <Icon icon="majesticons:hand-pointer-event-line" class="text-4xl w-16 h-16 mb-4 text-home-light z-[2]" aria-hidden="true" />
                    <h3 class="font-bold text-home-text-light text-lg z-[2]">Choose an Action</h3>
                    <p class="text-sm text-home-text-light z-[2]">
                        Select an event from your favorite service. For example, "New song added to Spotify playlist."
                    </p>
                </div>
                <div class="flex flex-col items-center w-1/3 min-w-[15rem]">
                    <Icon icon="icon-park-outline:robot-two" class="text-4xl w-16 h-16 mb-4 text-home-light z-[2]" aria-hidden="true" />
                    <h3 class="font-bold text-home-text-light text-lg z-[2]">Define a Reaction</h3>
                    <p class="text-sm text-home-text-light z-[2]">
                        Set the automated task you want to happen. For example, "Save song details to Dropbox."
                    </p>
                </div>
                <div class="flex flex-col items-center w-1/3 min-w-[15rem]">
                    <Icon icon="material-symbols:chair" class="text-4xl w-16 h-16 mb-4 text-home-light z-[2]" aria-hidden="true" />
                    <h3 class="font-bold text-home-text-light text-lg z-[2]">Let US Work</h3>
                    <p class="text-sm text-home-text-light z-[2]">
                        Sit back and relax as our app automates your workflows seamlessly.
                    </p>
                </div>
            </div>
            <button
                class="mt-16 w-48 h-12 bg-home-div text-white rounded-lg hover:cursor-pointer hover:bg-home-hover border-2 border-solid border-home-light z-[2]"
                @click="showDetails = !showDetails">
                {{ showDetails ? 'Hide Details' : 'Learn More' }}
            </button>

            <!-- Detailed Explanation Div -->
            <transition name="fade">
                <div v-if="showDetails" class="mt-16 p-6 bg-home-div text-white rounded-lg max-w-[50rem] half:w-[30rem] mobile:!w-[20rem] shadow-lg z-[2] flex flex-col">
                    <h3 class="text-xl font-bold mb-4 text-home-text">Detailed Explanation</h3>
                    <p class="text-md leading-6 text-home-text-light">
                        AREA operates by connecting various online services and enabling users to automate workflows
                        effortlessly. Here's how you can make the most of it:
                    </p>
                    <ul class="list-disc list-inside mt-4 text-md text-home-text-light">
                        <li><strong>Actions:</strong> Actions are events like a new file upload, an email receipt, or a new Spotify song.</li>
                        <li><strong>Reactions:</strong> Reactions are tasks our app executes when an action occurs, such as sending an email or saving data.</li>
                        <li><strong>AREAs:</strong> Combine actions and reactions from multiple services to create automation workflows.</li>
                    </ul>
                    <p class="mt-4 text-md text-home-text hover:cursor-pointer" @click="scrollToServices">
                        Explore all the services below for more examples and infos.
                    </p>
                </div>
            </transition>
        </div>

        <div id="services" class="flex flex-col items-center mobile:!pt-32 half:pt-20">
            <h2 class="text-2xl font-bold text-home-text mb-12 pt-24 z-[2]"><span class="text-home-light hover:cursor-pointer" @click="scrollToServices">#</span> SERVICES</h2>
            <div class="flex half:gap-4 gap-8 flex-wrap w-full justify-center z-[2] half:flex-col items-center">
                <div class="flex items-center h-48 half:h-12 justify-center">
                    <ArrowComponent
                        direction="left"
                        :animate="false"
                        color="#4C4CDC"
                        class="text-center hover:cursor-pointer half:hidden"
                        @click.stop="serviceIdx--" />
                    <ArrowComponent
                        direction="top"
                        :animate="false"
                        color="#4C4CDC"
                        class="text-center hover:cursor-pointer hidden half:flex mb-4"
                        @click.stop="serviceIdx--" />
                </div>
                <div
                    v-for="(service) in computedServices"
                    :key="service.name"
                    class="flex flex-col items-center p-4 rounded-md w-[19.5rem] h-48 justify-between z-[2]"
                    :style="{ backgroundColor: service.color }"
                    :aria-label="`Explore ${service.name}`"
                    role="button"
                    tabindex="0"
                    @click="handleServiceClick(service.name)">
                    <Icon :icon="service.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                    <span class="text-lg font-medium text-white capitalize">{{ service.name }}</span>
                    <p class="text-sm text-white">Automate tasks with {{ service.name.charAt(0).toUpperCase() + service.name.slice(1) }} effortlessly!</p>
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" textcolor="white" color="white" />
                </div>
                <div class="flex items-center h-48 half:h-12 justify-center">
                    <ArrowComponent
                        direction="right"
                        :animate="false"
                        color="#4C4CDC"
                        class="text-center hover:cursor-pointer half:hidden"
                        @click.stop="serviceIdx++" />
                    <ArrowComponent
                        direction="bottom"
                        :animate="false"
                        color="#4C4CDC"
                        class="text-center hover:cursor-pointer hidden half:flex mt-4"
                        @click.stop="serviceIdx++" />
                </div>
            </div>
            <button class="w-48 h-12 bg-home-div text-white rounded-lg mt-16 hover:cursor-pointer hover:bg-home-hover border-2 border-solid border-home-light z-[2]"
                @click="navigateTo('/explore')">Explore all services</button>
        </div>

        <div id="reviews" class="flex flex-col items-center justify-center mt-12 mobile:!pt-32 half:pt-20">
            <section class="flex justify-center gap-4 items-center w-full px-8 half:flex-col">
                <div class="flex flex-col gap-4 justify-center w-full max-w-[50rem]">
                    <h2 class="text-2xl font-bold text-home-text mb-4 pt-24 z-[2]"><span class="text-home-light hover:cursor-pointer" @click="scrollToReviews">#</span> REVIEWS</h2>
                    <p class="text-lg leading-6 text-home-text-light w-fit z-[2]">
                        "I love AREA! It's so easy to use and it makes my life so much easier. I can't imagine my life without it now." <span class="text-home-text">@anonymous</span>
                        <br><br>
                        "AREA is a game changer! I've been using it for a few weeks now and I'm already seeing the benefits. I highly recommend it." <span class="text-home-text">@anonymous</span>
                        <br><br>
                        "AREA is amazing! It's so simple to set up and it works like a charm. I'm so glad I found it." <span class="text-home-text">@anonymous</span>
                    </p>
                </div>
                <div
                    class="flex flex-col items-center p-4 gap-4 rounded-lg justify-between bg-home-div w-full half:mt-12 mt-32 z-[2] max-w-[25rem]">
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
                            @click="userRate = index" />
                        <Icon
                            icon="material-symbols:star-outline"
                            class="w-6 h-6 text-gray-100 hover:cursor-pointer"
                            v-for="index in (5 - userRate)"
                            :key="'empty-' + index"
                            @click="userRate = index + userRate" />
                    </div>
                    <button class="w-48 h-12 bg-home-light text-white rounded-lg mt-4 hover:cursor-pointer" @click="sendReview">Add a review</button>
                </div>
            </section>
        </div>

        <footer class="flex justify-between items-center flex-col h-64 half:!h-fit bg-home-div py-8 relative z-[2] mt-32">
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
                <p class="hover:underline hover:cursor-pointer">Mentions</p>
                <p class="hover:underline hover:cursor-pointer">Cookies</p>
                <p class="hover:underline hover:cursor-pointer">Privacy</p>
                <p class="hover:underline hover:cursor-pointer">Terms</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

import LogoComponent from '@/components/LogoComponent.vue';
import SignUpButtonText from '@/components/SignUpButtonText.vue';
import LoginButtonText from '@/components/LoginButtonText.vue';
import IconsComponent from '@/components/IconsComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import TimelineComponent from '@/components/TimelineComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import DashboardButtonText from '@/components/DashboardButtonText.vue';

import { Service } from '@/types/services';
import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/user';

import UserSvgComponent from '@/components/UserSvgComponent.vue';

const router = useRouter();
const scrollY = ref(0);
const serviceStore = useServiceStore();
const userReview = ref('');
const userRate = ref(1);
const showDetails = ref(false);
const userStore = useUserStore();
const user = ref(userStore.user);
const showMenu = ref<boolean>(false);

function sendReview() {
    console.log('Review:', userReview.value, 'Rate:', userRate.value);
    userReview.value = '';
    userRate.value = 0;
}

function navigateTo(route: string) {
    if (router) {
        router.push(route);
    } else {
        console.error('Router is not defined');
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

function scrollToAboutUs() {
    const aboutUs = document.getElementById('about-us');
    showMenu.value = false;
    if (aboutUs) {
        aboutUs.scrollIntoView({ block: "start", inline: "nearest", behavior: 'smooth' });
    }
};

function scrollToServices() {
    const services = document.getElementById('services');
    showMenu.value = false;
    if (services) {
        services.scrollIntoView({ block: "start", inline: "nearest", behavior: 'smooth' });
    }
};

function scrollToHowItWorks() {
    const howItWorks = document.getElementById('how-it-works');
    showMenu.value = false;
    if (howItWorks) {
        howItWorks.scrollIntoView({ block: "start", inline: "nearest", behavior: 'smooth' });
    }
};

function scrollToReviews() {
    const reviews = document.getElementById('reviews');
    showMenu.value = false;
    if (reviews) {
        reviews.scrollIntoView({ block: "start", inline: "nearest", behavior: 'smooth' });
    }
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
    let cols = (window.innerWidth - 450) / 400;
    if (window.innerWidth < 1024) {
        cols = 3;
    }
    const numServicesToShow = Math.min(cols, availableServices.value.length); // Dynamically adjust if fewer services
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
    availableServices.value = serviceStore.services;
    // wait 0.5s to get the user
    await new Promise(resolve => setTimeout(resolve, 500));
    user.value = userStore.user;
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
