<template>
    <div class="text-white font-sans h-screen flex flex-col">
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#13134c" class="z-50" />
        <div class="flex flex-col items-center justify-between web:h-1/4 mobile:h-full before:bg-[url('@/assets/svg/Grid9.svg')] before:absolute before:rotate-[-12deg] before:w-[200%] before:h-[300%] before:top-[-75%] before:left-[-50%] overflow-hidden relative before:z-0 before:opacity-30 bg-home">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
            <div class="flex justify-center items-center p-4 mobile:hidden z-10 -mt-8" v-if="scrollY == 0">
                <Icon icon="material-symbols:dashboard-rounded" class="w-28 h-28 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[4rem] leading-[3.5rem] font-bold">DASHBOARD</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">
                        What's happening today?
                    </h2>
                </div>
            </div>
            <div />
        </div>
        <!-- Main Content -->
        <div id="main-content" class="flex flex-col justify-center items-center w-full h-3/4 relative overflow-hidden bg-home border-t-4 border-white/5">
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
                    @mousedown="startDrag($event, index)"
                    @touchstart.prevent="startDrag($event, index)"
                    @click="!wasDragging && handleServiceClick(service.name)">
                    <Icon :icon="service.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                    <Icon :icon="positions[index].gravity == 0 ? 'ic:baseline-gps-fixed' : 'ic:baseline-gps-not-fixed'" class="text-2xl w-8 h-8 text-white absolute top-2 right-2" aria-hidden="true" @click.stop="switchGravity(positions[index])" />
                    <span class="text-lg font-medium text-white select-none capitalize">{{ service.name }}</span>
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" textcolor="white" color="white" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Service } from '@/types/services';
import { useServiceStore } from '@/stores/service';
import { Icon } from '@iconify/vue';

import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';

// Store and Router Initialization
const serviceStore = useServiceStore();
const router = useRouter();
const services = ref<Service[]>(serviceStore.services);
const scrollY = ref<number>(0);

// Functions
function handleBackButton() {
    router.push('/');
}

function startAnimation() {
    const width = document.getElementById('main-content')!.clientWidth;
    const nbColumns = Math.min(Math.floor(width / 350), services.value.length);
    console.log('Width:', width);
    positions.value = services.value.map((_, index) => ({
        x: (index % nbColumns) * 350 + 15 + (width / 2 - (nbColumns * 350) / 2),
        y: (Math.floor(index / nbColumns)) * 222 + 50,
        velocityY: 0,
        isDragging: false,
        gravity: 0,
    }));
    positions.value.forEach((position) => {
        position.velocityY = 0;
    });
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

const positions = ref<{
    x: number;
    y: number;
    velocityY: number;
    isDragging: boolean;
    gravity: number;
}[]>([]);

const damping = 0.4; // How much energy is lost on each bounce
const containerHeight = ref(0);

const wasDragging = ref<boolean>(false);

let animationFrame: number;

function applyPhysics() {
    if (positions.value.length === 0) {
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
            if (position.y >= containerHeight.value - 192) {
                position.y = containerHeight.value - 192;
                position.velocityY *= -damping;
            }
        }
    }
    animationFrame = requestAnimationFrame(applyPhysics);
}

function startDrag(event: MouseEvent | TouchEvent, index: number) {
    positions.value[index].isDragging = true;
    positions.value[index].velocityY = 0;
    wasDragging.value = false;

    let initialX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    let initialY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
        const currentY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

        const deltaX = currentX - initialX;
        const deltaY = currentY - initialY;

        wasDragging.value = true;

        positions.value[index].x += deltaX;
        positions.value[index].y += deltaY;

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
        positions.value[index].isDragging = false;
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

onMounted(async () => {
    containerHeight.value = document.getElementById('main-content')!.clientHeight;
    startAnimation();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
});
</script>
