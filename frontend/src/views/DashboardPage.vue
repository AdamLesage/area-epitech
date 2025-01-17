<template>
    <div>
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#1c1c53" class="z-[60] mobile:hidden" />
        <HelpAssistantPopupComponent :bottom="116" :left="16" color="#1c1c53" class="z-[60] web:hidden" />
        <button class="fixed bottom-4 mobile:bottom-28 right-4 z-[70] w-12 h-12 text-white rounded-full hover:cursor-pointer hover:bg-home-hover" v-if="scrollY != 0"
            :style="{ backgroundColor: '#1c1c53' }">
            <ArrowComponent
                direction="top"
                color="white"
                :animate="false"
                class="text-center"
                @click="scrollToTop" />
        </button>
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-28 before:bg-[url('@/assets/img/Grid2.png')] before:absolute before:rotate-[-12deg] before:w-[200%] before:h-[300%] before:top-[-75%] before:left-[-50%] overflow-hidden relative before:z-0 before:opacity-10"
            :style="{ backgroundColor: '#1c1c53' }">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-50" />
            <div class="flex justify-center items-center p-4 mobile:hidden z-50" v-if="scrollY == 0">
                <Icon icon="simple-icons:bento" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">MY AREA</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ areas.length }} Area{{ areas.length == 0 ? '' : 's' }}</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-50"
                :style="{ backgroundColor: '#1c1c53' }" v-else>
                <ServiceNavScrollComponent
                    title="MY AREA"
                    logo="simple-icons:bento"
                    @back-button="handleBackButton"
                    :redirect="false" />
            </div>
            <div class="flex justify-center items-center p-4 w-full h-28 web:hidden flex-shrink-0">
                <Icon icon="simple-icons:bento" class="web:w-36 mobile:w-[48px] web:h-36 mobile:h-[48px] text-white" />
                <div class="flex flex-col justify-end items-center web:p-4 mobile:p-2">
                    <h1 class="text-white web:text-[6rem] mobile:text-[2rem] web:leading-[5rem] mobile:leading-[1.75rem] font-bold">
                        MY AREA
                    </h1>
                </div>
            </div>
            <div class="flex w-full justify-center web:hidden m-4 z-50">
                <button class="rounded-full py-2 px-6 bg-white w-32 mobile:hidden">
                    <h1 class="font-semibold">Activate</h1>
                </button>
            </div>
            <div class="flex flex-col items-center z-50 justify-start w-full p-4 web:hidden gap-4 overflow-y-scroll h-1/2 mx-auto"
                @wheel.stop>
            </div>
            <div class="mobile:hidden z-50" />
            <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden z-50 fixed bottom-0 bg-home" />
        </div>

        <!-- Areas list -->
        <div class="flex w-full px-36 mobile:px-8 pt-16 bg-home-div/90 justify-center flex-wrap gap-8">
            <div
                v-for="(area, index) in areas"
                :key="area.id"
                class="w-[340px] shadow-lg flex flex-col mb-16 hover:cursor-pointer rounded-lg relative"
                @click="areaTooltip[index] = true">
                <div class="h-[8rem] w-full rounded-t-lg overflow-hidden bg-white justify-center items-center flex relative">
                    <h1 class="text-[#333] w-fit font-black">{{ area.title }}</h1>
                </div>
                <!-- Hidden tooltip -->
                <div v-if="areaTooltip[index]" class="fixed top-0 left-0 w-full h-full bg-black/50 z-[100000] flex justify-center items-center gap-12 mobile:gap-6 mobile:flex-col py-8"
                    @click.stop="areaTooltip[index] = false">
                    <div class="flex flex-col items-center justify-start overflow-y-scroll h-[50rem] mobile:h-1/2 bg-[#333] rounded-lg relative mobile:w-[90vw]" @click.stop>
                        <div class="flex gap-8 items-center justify-center py-4 bg-white w-full">
                            <h1 class="text-[#333] w-fit font-black text-2xl">{{ area.title }}</h1>
                            <span class="text-md absolute top-5 right-6" :class="area.isActive ? 'text-green-500' : 'text-red-500'">
                                {{ area.isActive ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                        <div class="w-full !h-2 flex-shrink-0"
                            :style="{ backgroundColor: area.isActive ? '#22c55e' : '#ef4444' }">
                        </div>
                        <div class="w-full h-full overflow-y-scroll">
                            <div class="p-6 flex flex-col gap-2 w-full text-white/70">
                                <p class="text-sm">UUID: {{ area.uuid }}</p>
                                <p class="text-sm">Created on: {{ formatDate(area.creationDate) }}</p>
                                <p class="text-sm">Description: {{ area.description || 'No description provided' }}</p>
                            </div>
    
                            <div class="px-6 mobile:px-0 pt-6 flex flex-col justify-center gap-2 w-[30rem] mobile:w-[90vw]"
                                :style="{ backgroundColor: getBackgroundColor(area.actionService) }">
                                <div class="flex gap-2 justify-center items-center">
                                    <Icon :icon="getIcon(area.actionService)" class="w-8 h-8 text-white" />
                                    <h1 class="text-xl font-extrabold text-white capitalize">{{ area.actionService }}</h1>
                                </div>
                                <div class="flex flex-col justify-center items-center mb-8">
                                    <p class="text-white text-center">Action: {{ area.actionName }}</p>
                                    <p class="text-white/70 text-center">{{ area.actionDescription }}</p>
                                </div>
                                <div class="border-t border-gray-200 p-6 w-full">
                                    <h3 class="text-lg font-bold text-white/80 mb-2">Action Data</h3>
                                    <div v-if="Object.keys(area.actionData).length" class="flex flex-col gap-2">
                                        <div
                                            v-for="(value, key) in area.actionData"
                                            :key="key"
                                            class="p-2 bg-gray-100 rounded-md shadow-sm h-fit">
                                            <p class="text-sm font-semibold text-gray-600">{{ key }}</p>
                                            <p class="text-sm text-gray-700" v-if="key !== 'accessToken'">{{ value }}</p>
                                            <p class="text-sm text-gray-700" v-else>********</p>
                                            <p class="text-sm text-gray-700" v-if="value == ''">No data given</p>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 italic">No action data available</p>
                                </div>
                            </div>
                            <div class="px-6 mobile:px-0 pt-6 pb-6 mobile:pb-0 flex flex-col justify-center gap-2 w-[30rem] rounded-b-xl mobile:w-[90vw]"
                                :style="{ backgroundColor: getBackgroundColor(area.reactionService) }">
                                <div class="flex gap-2 justify-center items-center">
                                    <Icon :icon="getIcon(area.reactionService)" class="w-8 h-8 text-white" />
                                    <h1 class="text-xl font-extrabold text-white capitalize">{{ area.reactionService }}</h1>
                                </div>
                                <div class="flex flex-col justify-center items-center mb-8">
                                    <p class="text-white text-center">Reaction: {{ area.reactionName }}</p>
                                    <p class="text-white/70 text-center">{{ area.reactionDescription }}</p>
                                </div>
                                <div class="border-t border-gray-200 p-6 w-full">
                                    <h3 class="text-lg font-bold text-white/80 mb-2">Reaction Data</h3>
                                    <div v-if="Object.keys(area.reactionData).length" class="flex flex-col gap-2">
                                        <div
                                            v-for="(value, key) in area.reactionData"
                                            :key="key"
                                            class="p-2 bg-gray-100 rounded-md shadow-sm h-fit">
                                            <p class="text-sm font-semibold text-gray-600">{{ key }}</p>
                                            <p class="text-sm text-gray-700" v-if="key !== 'accessToken'">{{ value }}</p>
                                            <p class="text-sm text-gray-700" v-else>********</p>
                                            <p class="text-sm text-gray-700" v-if="value == ''">No data given</p>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 italic">No reaction data available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white flex flex-col p-4 rounded-xl w-60 mobile:flex-row items-center mobile:w-[90vw] mobile:gap-8" @click.stop>
                        <h1 class="text-xl font-black text-[#333] text-center mb-4 mobile:hidden">Quick Actions</h1>
                        <button class="w-full py-2 px-8 mobile:px-4 mb-2 mobile:mb-0 bg-[#333] text-white rounded-md hover:cursor-pointer flex gap-2 items-center justify-center"
                            @click="toggleArea(area)"><Icon icon="lucide:mouse-pointer-click" class="text-white w-6 h-6 flex-shrink-0" />{{ area.isActive ? 'Deactivate' : 'Activate' }}</button>
                        <button class="w-full py-2 px-8 mobile:px-4 bg-[#333] text-white rounded-md hover:cursor-pointer flex gap-2 items-center justify-center"
                            @click="deleteArea(area)">
                            <Icon icon="mdi:delete" class="text-red-500 w-6 h-6" />Delete</button>
                    </div>
                </div>
                <!-- End of hidden tooltip -->
                <div class="w-full h-4"
                    :style="{ backgroundColor: area.isActive ? '#22c55e' : '#ef4444' }">
                </div>
                <div class="px-6 py-3 flex flex-col justify-center gap-2 h-full"
                    :style="{ backgroundColor: getBackgroundColor(area.actionService) }">
                    <div class="flex gap-2 justify-center items-center">
                        <Icon :icon="getIcon(area.actionService)" class="w-8 h-8 text-white" />
                        <h1 class="text-xl font-extrabold text-white capitalize">{{ area.actionService }}</h1>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <p class="text-white text-center">{{ area.actionName }}</p>
                        <p class="text-white/70 text-center">{{ area.actionDescription }}</p>
                    </div>
                </div>
                <div class="flex w-full justify-center h-12 flex-col items-center">
                    <ArrowComponent
                        direction="bottom"
                        color="white"
                        :animate="false"
                        class="text-center absolute bg-[#333] rounded-xl" />
                    <div class="h-1/2 w-full"
                        :style="{ backgroundColor: getBackgroundColor(area.actionService) }"/>
                    <div class="h-1/2 w-full"
                        :style="{ backgroundColor: getBackgroundColor(area.reactionService) }"/>
                </div>
                <div class="px-6 py-3 flex flex-col justify-center gap-2 h-full rounded-b-lg"
                    :style="{ backgroundColor: getBackgroundColor(area.reactionService) }">
                    <div class="flex gap-2 justify-center items-center">
                        <Icon :icon="getIcon(area.reactionService)" class="w-8 h-8 text-white" />
                        <h1 class="text-xl font-extrabold text-white capitalize">{{ area.reactionService }}</h1>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <p class="text-white text-center">{{ area.reactionName }}</p>
                        <p class="text-white/70 text-center">{{ area.reactionDescription }}</p>
                    </div>
                </div>
            </div>
            <div v-if="areas.length == 0" class="flex flex-col items-center justify-center w-full my-8 mb-16">
                <h1 class="text-3xl font-black text-white text-center">No areas found</h1>
                <p class="text-white text-center">You have not created any areas yet.</p>
            </div>
        </div>
    
        <!-- Services Animation -->
        <div id="main-content" class="flex flex-col justify-center items-center w-full relative border-t-4 border-white/5 bg-home-div/90 z-[40]"
            :style="{ height: `${services.length * 16.5}rem` }">
            <div class="bg-home-div rounded-full w-[12rem] h-[3.5rem] flex justify-center items-center text-home-text-light absolute -top-4 z-10">
                Explore
            </div>
            <div v-if="services.length && positions.length" class="absolute w-full h-full">
                <div
                    v-for="(service, index) in services"
                    :key="service.name"
                    class="flex flex-col items-center p-4 w-[20rem] h-48 justify-between z-[2] shadow-lg absolute rounded-md select-none"
                    :style="{
                        backgroundColor: service.color,
                        transform: `translate(${positions[index].x}px, ${positions[index].y}px)`,
                    }"
                    :aria-label="`Explore ${service.name}`"
                    role="button"
                    tabindex="0"
                    @mousedown="startDrag($event, index, 1)"
                    @touchstart.prevent="startDrag($event, index, 1)"
                    @click="!wasDragging && handleServiceClick(service.name)">
                    <Icon :icon="service.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                    <Icon :icon="positions[index].gravity == 0 ? 'ic:baseline-gps-fixed' : 'ic:baseline-gps-not-fixed'" class="text-2xl w-8 h-8 text-white absolute top-2 right-2" aria-hidden="true" @click.stop="switchGravity(positions[index])" />
                    <span class="text-lg font-medium text-white select-none capitalize">{{ service.name }}</span>
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" textcolor="white" color="white" />
                </div>
            </div>
        </div>

        <!-- Graph -->
        <div id="area-content" class="flex flex-col justify-center items-center w-full border-t-4 border-white/5 relative bg-home-div/90"
            :style="{ height: `${services.length * 16.5}rem` }">
            <div class="bg-home-div rounded-full w-[12rem] h-[3.5rem] flex justify-center items-center text-home-text-light absolute -top-4 z-10">
                Global Graph
            </div>
            <div v-if="services.length && positions2.length && positions2.length == areas.length + services.length" class="w-full h-full">
                <div
                    v-for="(service, index) in services"
                    :key="service.name"
                    class="flex flex-col items-center justify-center w-[4rem] h-[4rem] z-40 shadow-lg absolute rounded-full select-none"
                    :style="{
                        backgroundColor: service.color,
                        transform: `translate(${positions2[index].x}px, ${positions2[index].y}px)`,
                    }"
                    :aria-label="`Explore ${service.name}`"
                    role="button"
                    tabindex="0"
                    @mousedown="startDrag($event, index, 2)"
                    @touchstart.prevent="startDrag($event, index, 2)"
                    @click="!wasDragging && handleServiceClick(service.name)">
                    <Icon :icon="service.icon" class="text-4xl w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <div
                    v-for="(area, index) in areas"
                    :key="area.id"
                    :id="area.id.toString() + index"
                    :style="{
                        transform: `translate(${positions2[index + services.length].x}px, ${positions2[index + services.length].y}px)`,
                    }"
                    @mousedown="startDrag($event, index + services.length, 2)"
                    @touchstart.prevent="startDrag($event, index + services.length, 2)"
                    @click="!wasDragging && (areaTooltip[index] = true)"
                    class="w-[12rem] rounded-full flex flex-col select-none z-20 absolute hover:cursor-pointer">
                    <div class="p-3 flex flex-col justify-center gap-2 h-full rounded-t-lg"
                        :style="{ backgroundColor: getBackgroundColor(area.actionService) }">
                        <div class="flex gap-2 justify-center items-center">
                            <Icon :icon="getIcon(area.actionService)" class="w-6 h-6 text-white" />
                            <h1 class="text-md font-extrabold text-white capitalize">{{ area.actionService }}</h1>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <p class="text-white text-sm text-center">{{ area.actionName }}</p>
                        </div>
                    </div>
                    <hr class="border-0 h-1 bg-gradient-to-r from-white to-black"
                        :style="{ '--tw-gradient-from': getBackgroundColor(area.actionService), '--tw-gradient-to': getBackgroundColor(area.reactionService) }"/>
                    <div class="p-3 flex flex-col justify-center gap-2 h-full rounded-b-lg"
                        :style="{ backgroundColor: getBackgroundColor(area.reactionService) }">
                        <div class="flex gap-2 justify-center items-center">
                            <Icon :icon="getIcon(area.reactionService)" class="w-6 h-6 text-white" />
                            <h1 class="text-md font-extrabold text-white capitalize">{{ area.reactionService }}</h1>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <p class="text-white text-sm text-center">{{ area.reactionName }}</p>
                        </div>
                    </div>
                </div>
                <svg
                    v-for="(area, index) in areas"
                    :key="area.id"
                    class="absolute top-0 left-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
                    <!-- Line connecting to actionService -->
                    <line
                        :key="'line-action-' + area.actionService + index"
                        :x2="positions2[index + services.length]?.x + 96"
                        :y2="positions2[index + services.length]?.y + 50"
                        :x1="positions2[services.findIndex((act) => act.name === area.actionService)]?.x + 32"
                        :y1="positions2[services.findIndex((act) => act.name === area.actionService)]?.y + 32"
                        :stroke="getBackgroundColor(area.actionService)"
                        stroke-width="2"
                    />
                    <!-- Line connecting to reactionService -->
                    <line
                        :key="'line-reaction-' + area.reactionService + index"
                        :x2="positions2[index + services.length]?.x + 96"
                        :y2="positions2[index + services.length]?.y + 120"
                        :x1="positions2[services.findIndex((act) => act.name === area.reactionService)]?.x + 32"
                        :y1="positions2[services.findIndex((act) => act.name === area.reactionService)]?.y + 32"
                        :stroke="getBackgroundColor(area.reactionService)"
                        stroke-width="2"
                    />
                </svg>
            </div>
            <div v-if="services.length == 0">
                <div class="flex flex-col items-center justify-center w-full my-8 mb-16">
                    <h1 class="text-3xl font-black text-white text-center">Loading . . .</h1>
                </div>
            </div>
        </div>
        <div class="w-full h-12 bg-home-div/90" />

        <footer class="flex justify-between items-center flex-col h-64 half:!h-fit bg-home py-8 relative z-[2]">
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Service } from '@/types/services';

import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/user';

import { Icon } from '@iconify/vue';

import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';

import { Area } from '@/types/area';

import axios from 'axios';

// Store and Router Initialization
const serviceStore = useServiceStore();
const userStore = useUserStore();

const router = useRouter();
const services = ref<Service[]>(serviceStore.services);
console.log('Services:', services.value);
const scrollY = ref<number>(0);
const areas = ref<Area[]>(userStore.areas);
const containerHeight = ref(0);
const containerWidth = ref(0);

const areaTooltip = ref<boolean[]>(new Array(areas.value.length).fill(false));

watch(() => userStore.areas, (newAreas) => {
    areas.value = newAreas;
});

watch(() => serviceStore.services, (newServices) => {
    services.value = newServices;
    startAnimation();
});

window.addEventListener('resize', () => {
    containerWidth.value = window.innerWidth;
});

// Functions
function handleScroll(event: Event) {
    console.log('Scrolling');
    const target = event.target as HTMLElement;
    scrollY.value = target.scrollTop;
}

function navigateTo(path: string) {
    router.push(path);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

function getBackgroundColor(serviceName: string) {
    const service = services.value.find(service => service.name === serviceName);
    return service ? service.color : '#1c1c53';
}

function getIcon(serviceName: string) {
    const service = services.value.find(service => service.name === serviceName);
    return service ? service.icon : '';
}

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

function handleBackButton() {
    router.push('/');
}

function startAnimation() {
    if (services.value.length === 0)
        return;
    const width = containerWidth.value;
    const nbColumns = Math.min(Math.floor(width / 350), services.value.length);
    console.log('Width:', width);
    positions.value = services.value.map((_, index) => ({
        x: (index % nbColumns) * 350 + 15 + (width / 2 - (nbColumns * 350) / 2),
        y: (Math.floor(index / nbColumns)) * 222 + 100,
        velocityY: 0,
        isDragging: false,
        gravity: 0,
    }));
    positions2.value = services.value.map((_, index) => ({
        x: (index % nbColumns) * 350 + 140 + (width / 2 - (nbColumns * 350) / 2),
        y: (Math.floor(index / nbColumns)) * 222 + 100,
        velocityY: 0,
        isDragging: false,
        gravity: 0,
    })).concat(areas.value.map((_, index) => ({
        x: (index % nbColumns) * 350 + 76 + (width / 2 - (nbColumns * 350) / 2),
        y: (Math.floor(index / nbColumns)) * 200 + 220,
        velocityY: 0,
        isDragging: false,
        gravity: 0,
    })));
    animationFrame = requestAnimationFrame(applyPhysics);
}

function switchGravity(position: { gravity: number, velocityY: number }) {
    position.gravity = position.gravity === 0 ? 0.4 : 0;
    position.velocityY = 0;
}

function handleServiceClick(name: string) {
    console.log('Service clicked:', name);
    const service = services.value.find(service => service.name === name);
    if (!service) {
        console.error('Service not found');
        return;
    }
    console.log('Service:', service);
    router.push(`/service/${service.name.toLowerCase()}`);
}

async function toggleArea(area: Area) {
    console.log('Area toggled:', area);
    area.isActive = !area.isActive;
    const isActive = area.isActive;

    try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/action/set_active/${area.uuid}`, { isActive });

        console.log('Response:', res.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteArea(area: Area) {
    console.log('Area deleted:', area);
    // reset all tooltips
    areaTooltip.value = new Array(areas.value.length).fill(false);
    try {
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/action/${area.id}`);

        if (res.status !== 500 && res.status !== 404) {
            const index = areas.value.findIndex((a) => a.id === area.id);
            areas.value.splice(index, 1);
            cancelAnimationFrame(animationFrame);
            startAnimation();
        }
        console.log('Response:', res.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

const positions = ref<{
    x: number;
    y: number;
    velocityY: number;
    isDragging: boolean;
    gravity: number;
}[]>([]);

const positions2 = ref<{
    x: number;
    y: number;
    velocityY: number;
    isDragging: boolean;
    gravity: number;
}[]>([]);

const damping = 0.4; // How much energy is lost on each bounce

const wasDragging = ref<boolean>(false);

let animationFrame: number;

function applyPhysics() {
    if (positions.value.length === 0 || positions2.value.length === 0) {
        if (serviceStore.services.length > 0) {
            console.log('Services loaded:', serviceStore.services);
            services.value = serviceStore.services;
            startAnimation();
        }
        animationFrame = requestAnimationFrame(applyPhysics);
        return;
    }
    for (const position of positions.value) {
        if (!position.isDragging) {
            position.velocityY += position.gravity;
            position.y += position.velocityY;

            // Check bounds
            if (position.y >= containerHeight.value - 242) {
                position.y = containerHeight.value - 243;
                position.velocityY *= -damping;
            }
            if (position.y <= 50) {
                position.y = 51;
                position.velocityY *= -damping;
            }
            // check bounds x
            if (position.x >= containerWidth.value - 320) {
                position.x = containerWidth.value - 321;
                position.velocityY *= -damping;
            }
            if (position.x <= 0) {
                position.x = 1;
                position.velocityY *= -damping;
            }
        }
    }
    for (const position of positions2.value) {
        if (!position.isDragging) {
            position.velocityY += position.gravity;
            position.y += position.velocityY;

            const index = positions2.value.indexOf(position);

            if (index <= services.value.length) { // It is a service pin
                if (position.y >= containerHeight.value - 63) {
                    position.y = containerHeight.value - 64;
                    position.velocityY *= -damping;
                }
                if (position.y <= 50) {
                    position.y = 51;
                    position.velocityY *= -damping;
                }
                if (position.x >= containerWidth.value - 63) {
                    position.x = containerWidth.value - 64;
                    position.velocityY *= -damping;
                }
                if (position.x <= 0) {
                    position.x = 1;
                    position.velocityY *= -damping;
                }
            } else { // It is an area
                if (position.y >= containerHeight.value - 156) {
                    position.y = containerHeight.value - 157;
                    position.velocityY *= -damping;
                }
                if (position.y <= 50) {
                    position.y = 51;
                    position.velocityY *= -damping;
                }
                if (position.x >= containerWidth.value - 250) {
                    position.x = containerWidth.value - 251;
                    position.velocityY *= -damping;
                }
                if (position.x <= 0) {
                    position.x = 1;
                    position.velocityY *= -damping;
                }
            }
        }
    }
    animationFrame = requestAnimationFrame(applyPhysics);
}

function startDrag(event: MouseEvent | TouchEvent, index: number, num: number) {
    if (num == 1) {
        positions.value[index].isDragging = true;
        positions.value[index].velocityY = 0;
    } else {
        positions2.value[index].isDragging = true;
        positions2.value[index].velocityY = 0;
    }
    wasDragging.value = false;

    let initialX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    let initialY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
        const currentY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

        const deltaX = currentX - initialX;
        const deltaY = currentY - initialY;

        wasDragging.value = true;

        if (num == 1) {
            positions.value[index].x += deltaX;
            positions.value[index].y += deltaY;
        } else {
            positions2.value[index].x += deltaX;
            positions2.value[index].y += deltaY;
        }

        // Check bounds
        if (num == 1) {
            if (positions.value[index].y >= containerHeight.value - 242) {
                positions.value[index].y = containerHeight.value - 243;
            }
            if (positions.value[index].y <= 50) {
                positions.value[index].y = 51;
            }
            if (positions.value[index].x >= containerWidth.value - 320) {
                positions.value[index].x = containerWidth.value - 321;
            }
            if (positions.value[index].x <= 0) {
                positions.value[index].x = 1;
            }
        } else {
            // it is a services pin
            console.log(index)
            if (index < services.value.length) {
                if (positions2.value[index].y >= containerHeight.value - 63) {
                    positions2.value[index].y = containerHeight.value - 64;
                }
                if (positions2.value[index].y <= 50) {
                    positions2.value[index].y = 51;
                }
                if (positions2.value[index].x >= containerWidth.value - 63) {
                    positions2.value[index].x = containerWidth.value - 64;
                }
                if (positions2.value[index].x <= 0) {
                    positions2.value[index].x = 1;
                }
            } else { // It is an area
                if (positions2.value[index].y >= containerHeight.value - 155) {
                    positions2.value[index].y = containerHeight.value - 156;
                }
                if (positions2.value[index].y <= 50) {
                    positions2.value[index].y = 51;
                }
                if (positions2.value[index].x >= containerWidth.value - 191) {
                    positions2.value[index].x = containerWidth.value - 192;
                }
                if (positions2.value[index].x <= 0) {
                    positions2.value[index].x = 1;
                }
            }
        }

        // Update initial positions for smooth drag
        if (moveEvent instanceof MouseEvent) {
            initialX = moveEvent.clientX;
            initialY = moveEvent.clientY;
        } else {
            initialX = moveEvent.touches[0].clientX;
            initialY = moveEvent.touches[0].clientY;
        }
    };

    const stopDrag = () => {
        if (num == 1)
            positions.value[index].isDragging = false;
        else
            positions2.value[index].isDragging = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", stopDrag);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", stopDrag);
}

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
});

onMounted(async () => {
    // wait 1s
    await new Promise(resolve => setTimeout(resolve, 1000));
    scrollY.value = window.scrollY;

    if (serviceStore.services.length == 0) {
        // wait 1 more s
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    services.value = serviceStore.services;
    await new Promise(resolve => setTimeout(resolve, 200));
    const div = document.getElementById('area-content');
    containerHeight.value = div?.clientHeight || 0;
    containerWidth.value = div?.clientWidth || 0;
    startAnimation();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
});
</script>
