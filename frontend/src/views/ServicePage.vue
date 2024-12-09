<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import SaveComponent from '@/components/SaveComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';

const route = useRoute();
const router = useRouter();

const serviceId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const store = useServiceStore();
console.log('Service ID:', serviceId);
const service = store.services.find(service => service.name === serviceId);
console.log('Service:', service);

if (service === undefined) {
    console.error('Service not found');
    router.push('/dashboard');
}

const color = ref<string>(service!.color);
const name = ref<string>(service!.name);
const logo = ref<string>(service!.icon);
const rate = ref<number>(service!.reviews.rate);
const reviews = ref<number>(service!.reviews.count);
const saves = ref<number>(service!.saves);
const isActivated = ref<boolean>(true);
const nbActions = ref<number>(0);

if (service?.actions) {
    nbActions.value = service.actions.length;
}

const nbTriggers = ref<number>(0);

if (service?.reactions) {
    nbTriggers.value = service.reactions.length;
}

const nameCapitalized = ref(name.value.toUpperCase());
const isHeroVisible = ref(true);

const isCircleFirst = ref(true);
const scrollY = ref(0);

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})

const handleClick = () => {
    isActivated.value = !isActivated.value;
    isCircleFirst.value = !isCircleFirst.value;
}

const openServicePage = () => {
    console.log('Service page opened');
    isHeroVisible.value = false;
}

const handleBackButtonSecondPage = () => {
    console.log('Back button clicked on second page');
    isHeroVisible.value = true;
}

function handleMenuClick(name: string) {
    console.log('Menu clicked on:', name);
}

function handleMoreClick(name: string) {
    console.log('More clicked on:', name);
}

function handleConfigureClick(name: string) {
    console.log('Configure clicked on:', name);
}

function handleBackButtonFirstPage() {
    console.log('Back button clicked on first page');
    router.push('/dashboard');
}

function handleScrollAttempt(event: WheelEvent) {
    if (event.deltaY > 0) {
        openServicePage();
    }
}

function handleScrollAttemptSecondPage(event: WheelEvent) {
    if (event.deltaY < 0 && scrollY.value === 0) {
        isHeroVisible.value = true;
    }
}
</script>

<template>
    <!-- First Page -->
    <div
        :style="{ backgroundColor: color }"
        class="flex flex-col justify-between"
        @click="openServicePage"
        @wheel="handleScrollAttempt"
        v-if="isHeroVisible">
        <ServiceNavComponent @back-button="handleBackButtonFirstPage" />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
                </div>
            </div>
            <div
                class="border-4 border-auth-neutral w-[300px] h-[90px] rounded-full bg-white flex justify-between items-center px-4 cursor-pointer transition-transform duration-300"
                @click.stop="handleClick">
                <div
                    v-if="isCircleFirst" 
                    class="rounded-full w-[60px] h-[60px] transition-all duration-500" 
                    :style="{ backgroundColor: color }" 
                />
                <h1
                    class="text-xl font-semibold w-1/2 transition-all duration-500 select-none" 
                    :style="{ color: color, textAlign: isCircleFirst ? 'left' : 'right' }"
                >
                    {{ isCircleFirst ? 'Activate' : 'Deactivate' }}
                </h1>
                <div
                    v-if="!isCircleFirst"
                    class="rounded-full w-[60px] h-[60px] transition-all duration-500" 
                    :style="{ backgroundColor: color }" 
                />
            </div>
        </div>
        <div class="flex justify-between items-center p-4">
            <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" />
            <ArrowComponent color="white" />
            <SaveComponent :saves="saves" color="white" textcolor="white" />
        </div>
    </div>
    <!-- Second Page -->
    <div
        @wheel="handleScrollAttemptSecondPage"
        v-else>
        <div class="flex flex-col items-center justify-between h-1/2"
            :style="{ backgroundColor: color }">
            <ServiceNavComponent @back-button="handleBackButtonSecondPage" />
            <div class="flex justify-center items-center p-4" v-if="scrollY == 0">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full"
                :style="{ backgroundColor: color }"
                v-else>
                <ServiceNavScrollComponent @back-button="handleBackButtonSecondPage"
                    :logo="logo" :title="nameCapitalized" />
            </div>
            <div />
        </div>
        <div class="flex justify-between items-center p-8">
            <RateComponent :rate="rate" :reviews="reviews" :color="color" textcolor="black" class="w-1/3" />
            <div class="w-1/3 flex justify-center">
                <div 
                    class="border-4 border-auth-neutral w-[300px] h-[90px] rounded-full bg-white flex justify-between items-center px-4 cursor-pointer transition-transform duration-300"
                    @click.stop="handleClick">
                    <div 
                        v-if="isCircleFirst" 
                        class="rounded-full w-[60px] h-[60px] transition-all duration-500" 
                        :style="{ backgroundColor: color }" 
                    />
                    <h1
                        class="text-xl font-semibold w-1/2 transition-all duration-500 select-none" 
                        :style="{ color: color, textAlign: isCircleFirst ? 'left' : 'right' }"
                    >
                        {{ isCircleFirst ? 'Activate' : 'Deactivate' }}
                    </h1>
                    <div 
                        v-if="!isCircleFirst"
                        class="rounded-full w-[60px] h-[60px] transition-all duration-500" 
                        :style="{ backgroundColor: color }" 
                    />
                </div>
            </div>
            <SaveComponent :saves="saves" :color="color" textcolor="black" class="w-1/3 flex justify-end" />
        </div>
        <div class="flex flex-wrap gap-8 p-8 justify-center"
            v-if="service && service.actions">
            <AREAInfoComponent
                v-for="action in service.actions"
                :key="action.name"
                :values="action"
                :icon="logo"
                :color="color"
                @menu-click="handleMenuClick(action.name)"
                @more-click="handleMoreClick(action.name)"
                @configure-click="handleConfigureClick(action.name)" />
            <AREAInfoComponent
                v-for="reaction in service.reactions"
                :key="reaction.name"
                :values="reaction"
                :icon="logo"
                :color="color"
                @menu-click="handleMenuClick(reaction.name)"
                @more-click="handleMoreClick(reaction.name)"
                @configure-click="handleConfigureClick(reaction.name)" />
        </div>
    </div>
</template>
