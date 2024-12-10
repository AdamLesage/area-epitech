<template>
    <!-- First Page -->
    <div :style="{ backgroundColor: color }" class="flex flex-col justify-between" @click="openServicePage"
        @wheel="handleScrollAttempt" v-if="isHeroVisible">
        <ServiceNavComponent @back-button="handleBackButtonFirstPage" @redirect-user-profile="handleRedirectUserPage"
            class="mobile:hidden" />
        <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" class="web:hidden p-4 mobile:hidden" />
        <div />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1
                        class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">
                        {{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }}
                        {{ nbActions <= 1 ? 'Area' : 'Areas'}}</h2>
                </div>
            </div>

        </div>
        <div class="flex flex-col web:hidden gap-2">
            <h2 class="text-white text-xl font-bold text-center w-full pr-2">{{ nbActions }} Areas</h2>
            <div class="flex flex-row gap-2 items-center justify-center mobile:hidden">
                <button class="rounded-full py-2 px-6 bg-white w-32 mobile:hidden">
                    <h1 class="font-semibold">Activate</h1>
                </button>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer" />
            </div>
        </div>
        <div class="flex justify-center items-center p-4 mobile:hidden">
            <ArrowComponent color="white" class="mobile:hidden" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButtonFirstPage" class="web:hidden" />
    </div>
    <!-- Second Page -->
    <div @wheel="handleScrollAttemptSecondPage" v-else>
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-full"
            :style="{ backgroundColor: color }">
            <ServiceNavComponent @back-button="handleBackButtonSecondPage"
                @redirect-user-profile="handleRedirectUserPage" class="mobile:hidden" />
            <div class="flex justify-center items-center p-4 mobile:hidden" v-if="scrollY == 0">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbActions }} Actions</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden"
                :style="{ backgroundColor: color }" v-else>
                <ServiceNavScrollComponent @back-button="handleBackButtonSecondPage" :logo="logo"
                    :title="nameCapitalized" />
            </div>
            <div class="flex justify-between items-center w-full web:hidden">
                <div class="flex web:justify-center items-center p-4 w-full mobile:justify-start">
                    <Icon :icon="logo" class="web:w-36 mobile:w-[48px] web:h-36 mobile:h-[48px] text-white" />
                    <div class="flex flex-col justify-end items-center web:p-4 mobile:p-2">
                        <h1
                            class="text-white web:text-[6rem] mobile:text-[2rem] web:leading-[5rem] mobile:leading-[1.75rem] font-bold">
                            {{ nameCapitalized }}</h1>
                        <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }}
                            Actions</h2>
                    </div>
                </div>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer mr-4 mobile:hidden" />
            </div>
            <div class="flex w-full justify-center web:hidden m-4">
                <button class="rounded-full py-2 px-6 bg-white w-32 mobile:hidden">
                    <h1 class="font-semibold">Activate</h1>
                </button>
            </div>
            <div class="flex flex-col items-center justify-start w-full p-4 web:hidden gap-4 overflow-y-scroll h-1/2 mx-auto"
                @wheel.stop>
                <div class="flex justify-center w-full">
                    <button @click="handleCreateButtonClick" class="rounded-full py-2 px-6 bg-blue-500 text-white w-32">
                        <h1 class="font-semibold">Create Area</h1>
                    </button>
                </div>
                <AREACreationComponent v-if="showCreationComponent" @close="handleCloseCreationComponent" />
                <AREAInfoComponent v-for="action in actions" :key="action.name" :values="action" :icon="action.icon"
                    :color="action.color" @menu-click="handleMenuClick(action.name)"
                    @more-click="handleMoreClick(action.name)" @configure-click="handleConfigureClick(action.name)" />
            </div>
            <div class="mobile:hidden" />
            <MobileServiceNavComponent @back-button="handleBackButtonSecondPage" class="web:hidden" />
        </div>
        <div class="flex justify-center items-center p-8 mobile:hidden">
            <button @click="handleCreateButtonClick" class="rounded-full py-2 px-6 bg-blue-500 text-white w-32 ml-4">
                <h1 class="font-semibold">Create Area</h1>
            </button>
        </div>
        
            <AREACreationComponent v-if="showCreationComponent" @close="handleCloseCreationComponent" />
        <div class="flex flex-wrap gap-8 p-8 justify-center mobile:hidden">
            <AREAInfoComponent v-for="action in actions" :key="action.name" :values="action" :icon="action.icon"
                :color="action.color" @menu-click="handleMenuClick(action.name)"
                @more-click="handleMoreClick(action.name)" @configure-click="handleConfigureClick(action.name)" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/users';

import axios from 'axios';
import Cookies from 'js-cookie';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import SaveComponent from '@/components/SaveComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';
import AREACreationComponent from '@/components/AREACreationComponent.vue';

const userStore = useUserStore();
const router = useRouter();

const color = ref<string>('#1C1C53');
const name = ref<string>('MyArea');
const logo = ref<string>('mdi:home-modern');
const rate = ref<number>(4.5);
const reviews = ref<number>(120);
const saves = ref<number>(50);
const isActivated = ref<boolean>(true);
const nbActions = ref<number>(5);

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

const actions = ref<Array<{ name: string, description: string, icon: string, color: string }>>([]);

const showCreationComponent = ref(false);

const handleCreateButtonClick = () => {
    showCreationComponent.value = true;
}

const handleCloseCreationComponent = () => {
    showCreationComponent.value = false;
}

onMounted(async () => {
    const user = userStore.user;
    if (!user) {
        console.error('User not logged in');
        router.push('/dashboard');
    }
    const token = Cookies.get('token');
    if (!token) {
        console.error('Token not found');
        router.push('/');
    }
    const res: { status: number, data: [{
        title: string, actionId: number, reactionId: number
    }] } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/areas`,
        {
            params: {
                email: user!.email,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    for (const area of res.data) {
        console.log('Area:', area.title);
        actions.value.push({
            name: area.title,
            description: 'Action: ' + area.actionId + ' Reaction: ' + area.reactionId,
            icon: 'mdi:home-modern',
            color: '#1C1C53',
        });
    }
    nbActions.value = actions.value.length;
    console.log(res);
})
</script>
