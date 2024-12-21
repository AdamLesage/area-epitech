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
import ArrowComponentBottom from '@/components/ArrowComponentBottom.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';

const route = useRoute();
const router = useRouter();

const serviceId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const store = useServiceStore();
console.log('Service ID:', serviceId);
const service = store.services.find(service => service.name === serviceId) || null;
console.log('Service:', service);

if (!service) {
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
const nbReactions = ref<number>(0);

const view = ref<string>('overview');

function switchView(newView: string) {
    console.log('Switching view to:', newView);
    view.value = newView;
}

if (service && service.categories) {
    for (const category of service.categories) {
        console.log('Category:', category);
        nbActions.value += category.actions.length;
        nbReactions.value += category.reactions.length;
    }
} else {
    console.error('No categories found in service');
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
    window.history.back();
}

function handleRedirectUserPage() {
    console.log('Redirecting to user page');
    router.push('/userinfo');
}

function handleAreaRedirect() {
    console.log('Redirecting to area page');
    router.push('/areas');
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

function scrollToHavingTrouble() {
    const element = document.getElementById('having-trouble');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
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
            @redirect-my-areas="handleAreaRedirect"
            class="mobile:hidden" />
        <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" class="web:hidden p-4" />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
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
            <h2 class="text-white text-xl font-bold text-center w-full pr-2">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
            <div class="flex flex-row gap-2 items-center justify-center">
                <button class="rounded-full py-2 px-6 bg-white w-32">
                    <h1 class="font-semibold">Activate</h1>
                </button>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer" />
            </div>
        </div>
        <div class="flex justify-between items-center p-4 mobile:hidden">
            <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" />
            <ArrowComponentBottom color="white" class="mobile:hidden" :animate="true" />
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
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
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
                        <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
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
                v-if="service">
                <div v-for="category in service.categories" :key="category.name">
                    <h1 class="text-white bg-black text-xl font-bold p-2 rounded-full w-full text-center">{{ category.name }}</h1>
                </div>
            </div>
            <div class="mobile:hidden" />
            <MobileServiceNavComponent @back-button="handleBackButtonSecondPage" class="web:hidden" />
        </div>
        <div class="flex justify-between items-center p-8 mobile:hidden web:hidden">
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
        <div class="flex justify-center w-full gap-8 mt-6">
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'overview' ? 'underline' : ''"
                :style="{ color: service!.color, textDecorationColor: service!.color }"
                @click="switchView('overview')">
                Overview
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'actions' ? 'underline' : ''"
                :style="{ color: service!.color, textDecorationColor: service!.color }"
                @click="switchView('actions')">
                Actions
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'reactions' ? 'underline' : ''"
                :style="{ color: service!.color, textDecorationColor: service!.color }"
                @click="switchView('reactions')">
                Reactions
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'details' ? 'underline' : ''"
                :style="{ color: service!.color, textDecorationColor: service!.color }"
                @click="switchView('details')">
                Details
            </button>
        </div>
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'actions'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white" />
                <h1 class="text-3xl font-extrabold text-white mb-2">Actions: {{ nbActions }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Actions are triggered by events on the platform. They are retrieved automatically.<br />
                    Click on an action card to see more details.
                </p>
            </div>
            <div v-for="(category) in service.categories" :key="category.name"
                class="flex justify-center w-[66.75rem]">
                <div class="flex flex-col items-center w-full gap-4 mt-6" v-if="category.actions.length != 0">
                    <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1" :style="{ color: service.color }">{{ category.display_name }}</h1>
                    <div class="flex flex-wrap gap-6 w-full">
                        <AREAInfoComponent
                            v-for="action in category.actions"
                            :key="action.name"
                            :object="action"
                            :color="service.color"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'reactions'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white" />
                <h1 class="text-3xl font-extrabold text-white mb-2">Reactions: {{ nbReactions }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Reactions are triggered by actions on the platform. They are executed automatically.<br />
                    Click on a reaction card to see more details.
                </p>
            </div>
            <div v-for="(category) in service.categories" :key="category.name"
                class="flex justify-center w-[66.75rem]">
                <div class="flex flex-col items-center w-full gap-4 mt-6" v-if="category.reactions.length != 0">
                    <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1" :style="{ color: service.color }">{{ category.display_name }}</h1>
                    <div class="flex flex-wrap gap-6 w-full">
                        <AREAInfoComponent
                            v-for="reaction in category.reactions"
                            :key="reaction.name"
                            :object="reaction"
                            :color="service.color"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'details'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white" />
                <h1 class="text-3xl font-extrabold text-white">{{ nameCapitalized }}</h1>
                <p class="text-lg text-white/80 text-center">
                    color: {{ service.color }}
                </p>
            </div>
            <div class="flex flex-col justify-center items-start w-[66.75rem] p-6 gap-4">
                <div class="flex justify-between w-full">
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" :color="service.color" textcolor="#6b7280"/>
                    <SaveComponent :saves="service.saves" :color="service.color" textcolor="#6b7280"/>
                </div>
                <h1 class="text-xl font-black text-start w-full rounded-lg pl-1 text-gray-900 mt-4">Categories:</h1>
                <div class="flex justify-start flex-wrap w-full gap-4">
                    <div class="gap-4 px-4 py-1 rounded-md" :style="{ backgroundColor: service.color }" v-for="category in service.categories" :key="category.name">
                        <h1 class="text-lg font-semibold text-start w-full rounded-lg text-white">{{ category.display_name }}</h1>
                    </div>
                </div>
                <h1 id="having-trouble" class="text-xl font-black text-start w-full rounded-lg pl-1 text-gray-900 mt-8 mb-4"><span class="hover:cursor-pointer text-gray-500" @click="scrollToHavingTrouble">#</span> Having trouble ?</h1>
                <!-- Trouble advices -->
                <!-- Verify your connected to the service, check the different service actions and reactions card description -->
                <div class="flex flex-col w-full gap-6">
                    <div class="flex justify-start gap-4 items-center pl-8">
                        <span class="h-12 w-1.5 rounded-md" :style="{ backgroundColor: service.color }" />
                        <div class="flex flex-col w-full">
                            <h1 class="text-lg font-semibold text-start w-full rounded-lg text-gray-900">Verify your connected to the service</h1>
                            <p class="text-lg text-start w-full text-gray-500">Make sure you are connected to the service. If not, please connect to the service.</p>
                        </div>
                    </div>
                    <div class="flex justify-start gap-4 items-center pl-8">
                        <span class="h-16 w-1.5 rounded-md" :style="{ backgroundColor: service.color }" />
                        <div class="flex flex-col w-full">
                            <h1 class="text-lg font-semibold text-start w-full rounded-lg text-gray-900">Check the different service actions and reactions card description</h1>
                            <p class="text-lg text-start w-full text-gray-500">Make sure you understand the different actions and reactions card description. If not, please read the card description.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="flex justify-between items-center flex-col h-64 py-8 mt-12" :style="{ backgroundColor: service!.color }">
            <h1 class="text-3xl font-black text-white text-center mb-8">CONTACT US</h1>
            <div class="flex w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-white" />
                    <p class="text-white hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                </div>
                <p class="w-full text-center text-white">Project made under Epitech © PGE program</p>
                <h1 class="text-4xl font-black text-white/60 text-center w-full hover:cursor-pointer" @click="scrollToTop">AREA</h1>
            </div>
            <div class="flex justify-center items-center gap-8 mt-8 text-white/60 text-sm">
                <p class="hover:underline hover:cursor-pointer">Mentions</p>
                <p class="hover:underline hover:cursor-pointer">Cookies</p>
                <p class="hover:underline hover:cursor-pointer">Privacy</p>
                <p class="hover:underline hover:cursor-pointer">Terms</p>
            </div>
        </footer>
    </div>
</template>
