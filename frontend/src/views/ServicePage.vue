<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
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

function handleRedirectUserPage() {
    console.log('Redirecting to user page');
    router.push('/userinfo');
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
        <ServiceNavComponent
            @back-button="handleBackButtonFirstPage"
            @redirect-user-profile="handleRedirectUserPage"
            class="mobile:hidden" />
        <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" class="web:hidden p-4" />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
                </div>
            </div>
            <div
            class="border-4 border-auth-neutral w-[300px] h-[90px] rounded-full bg-white flex justify-between items-center px-4 cursor-pointer transition-transform duration-300 mobile:hidden"
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
        <div class="flex flex-col web:hidden gap-2">
            <h2 class="text-white text-xl font-bold text-center w-full pr-2">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
            <div class="flex flex-row gap-2 items-center justify-center">
                <button class="rounded-full py-2 px-6 bg-white w-32">
                    <h1 class="font-semibold">Activate</h1>
                </button>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer" />
            </div>
        </div>
        <div class="flex justify-between items-center p-4 mobile:hidden">
            <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" />
            <ArrowComponent color="white" class="mobile:hidden" />
            <SaveComponent :saves="saves" color="white" textcolor="white" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButtonFirstPage" class="web:hidden" />
    </div>
    <!-- Second Page -->
    <div
        @wheel="handleScrollAttemptSecondPage"
        v-else>
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-full"
            :style="{ backgroundColor: color }">
            <ServiceNavComponent
                @back-button="handleBackButtonSecondPage"
                @redirect-user-profile="handleRedirectUserPage"
                class="mobile:hidden" />
            <div class="flex justify-center items-center p-4 mobile:hidden" v-if="scrollY == 0">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden"
                :style="{ backgroundColor: color }"
                v-else>
                <ServiceNavScrollComponent @back-button="handleBackButtonSecondPage"
                    :logo="logo" :title="nameCapitalized" />
            </div>
            <div class="flex justify-between items-center w-full web:hidden">
                <div class="flex web:justify-center items-center p-4 w-full mobile:justify-start">
                    <Icon :icon="logo" class="web:w-36 mobile:w-[48px] web:h-36 mobile:h-[48px] text-white" />
                    <div class="flex flex-col justify-end items-center web:p-4 mobile:p-2">
                        <h1 class="text-white web:text-[6rem] mobile:text-[2rem] web:leading-[5rem] mobile:leading-[1.75rem] font-bold">{{ nameCapitalized }}</h1>
                        <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbTriggers }} Triggers / {{ nbActions }} Actions</h2>
                    </div>
                </div>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer mr-4" />
            </div>
            <div class="flex w-full justify-center web:hidden m-4">
                <button class="rounded-full py-2 px-6 bg-white w-32">
                    <h1 class="font-semibold">Activate</h1>
                </button>
            </div>
            <div class="flex flex-col items-center justify-start w-full p-4 web:hidden gap-4 overflow-y-scroll"
                @wheel.stop
                v-if="service && service.actions && service.reactions">
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
            <div class="mobile:hidden" />
            <MobileServiceNavComponent @back-button="handleBackButtonSecondPage" class="web:hidden" />
        </div>
        <div class="flex justify-between items-center p-8 mobile:hidden">
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
        <div class="flex flex-wrap gap-8 p-8 justify-center mobile:hidden"
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
