<template>
    <!-- First Page -->
    <div :style="{ backgroundColor: '#1C1C53' }" class="flex flex-col justify-between" @click="openServicePage"
        @wheel="handleScrollAttempt" v-if="isHeroVisible">
        <HelpAssistantPopupComponent :bottom="8" :left="8" color="#1C1C53" class="z-50" />
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon icon="simple-icons:bento" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1
                        class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">
                        MY AREA</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ areas.length }}
                        {{ areas.length <= 1 ? 'Area' : 'Areas'}}</h2>
                </div>
            </div>
        </div>
        <div class="flex flex-col web:hidden gap-2">
            <h2 class="text-white text-xl font-bold text-center w-full pr-2">{{ areas.length }} Area{{ areas.length == 0 ? '' : 's' }}</h2>
            <div class="flex flex-row gap-2 items-center justify-center mobile:hidden">
                <button class="rounded-full py-2 px-6 bg-white w-32 mobile:hidden">
                    <h1 class="font-semibold">Activate</h1>
                </button>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer" />
            </div>
        </div>
        <div class="flex justify-center items-center p-4 mobile:hidden">
            <ArrowComponentBottom color="white" class="mobile:hidden" :animate="true" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden" />
    </div>
    <!-- Second Page -->
    <div @wheel="handleScrollAttemptSecondPage" v-else>
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#1C1C53" class="z-50" />
        <button class="fixed bottom-4 right-4 z-[100] w-12 h-12 text-white rounded-full hover:cursor-pointer hover:bg-home-hover" v-if="scrollY != 0"
            :style="{ backgroundColor: '#1C1C53' }">
            <ArrowComponentTop color="white" class="text-center" @click="scrollToTop" :animate="false" />
        </button>
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-full mb-12"
            :style="{ backgroundColor: '#1C1C53' }">
            <ServiceNavComponent @back-button="handleBackButton"
                @redirect-user-profile="handleRedirectUserPage" class="mobile:hidden" />
            <div class="flex justify-center items-center p-4 mobile:hidden" v-if="scrollY == 0">
                <Icon icon="simple-icons:bento" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">MY AREA</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ areas.length }} Area{{ areas.length == 0 ? '' : 's' }}</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden"
                :style="{ backgroundColor: '#1C1C53' }" v-else>
                <ServiceNavScrollComponent
                    title="MY AREA"
                    logo="simple-icons:bento"
                    @back-button="handleBackButton"
                    :redirect="false" />
            </div>
            <div class="flex justify-between items-center w-full web:hidden">
                <div class="flex web:justify-center items-center p-4 w-full mobile:justify-start">
                    <Icon icon="simple-icons:bento" class="web:w-36 mobile:w-[48px] web:h-36 mobile:h-[48px] text-white" />
                    <div class="flex flex-col justify-end items-center web:p-4 mobile:p-2">
                        <h1
                            class="text-white web:text-[6rem] mobile:text-[2rem] web:leading-[5rem] mobile:leading-[1.75rem] font-bold">
                            MY AREA</h1>
                        <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ areas.length }}
                            Area{{ areas.length == 0 ? '' : 's' }}</h2>
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
            </div>
            <div class="mobile:hidden" />
            <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden" />
        </div>

        <div class="flex flex-wrap gap-8 p-8 justify-center mobile:hidden">
            <div
                v-for="area in areas"
                :key="area.id"
                class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
                <div :style="{ backgroundColor: area.isActive ? '#22c55e' : '#ef4444' }" class="h-2 w-full"></div>
                <div class="p-6 flex flex-col gap-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-extrabold text-gray-800">AREA: {{ area.title }}</h2>
                        <span :class="area.isActive ? 'text-green-600' : 'text-red-600'">
                            {{ area.isActive ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500">UUID: {{ area.uuid }}</p>
                    <p class="text-sm text-gray-500">Created on: {{ formatDate(area.creationDate) }}</p>
                    <p class="text-sm text-gray-500">Description: {{ area.description || 'No description provided' }}</p>
                </div>

                <div class="border-t border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-gray-700 mb-2">Action Data</h3>
                    <div v-if="Object.keys(area.actionData).length" class="flex flex-col gap-2">
                        <div
                            v-for="(value, key) in area.actionData"
                            :key="key"
                            class="p-2 bg-gray-100 rounded-md shadow-sm"
                        >
                            <p class="text-sm font-semibold text-gray-600">{{ key }}</p>
                            <p class="text-sm text-gray-700" v-if="key !== 'accessToken'">{{ value }}</p>
                            <p class="text-sm text-gray-700" v-else>********</p>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic">No action data available</p>
                </div>

                <div class="border-t border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-gray-700 mb-2">Reaction Data</h3>
                    <div v-if="Object.keys(area.reactionData).length" class="flex flex-col gap-2">
                        <div
                            v-for="(value, key) in area.reactionData"
                            :key="key"
                            class="p-2 bg-gray-100 rounded-md shadow-sm"
                        >
                            <p class="text-sm font-semibold text-gray-600">{{ key }}</p>
                            <p class="text-sm text-gray-700" v-if="key !== 'accessToken'">{{ value }}</p>
                            <p class="text-sm text-gray-700" v-else>********</p>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic">No reaction data available</p>
                </div>

                <div class="border-t border-gray-200 p-6">
                    <p class="text-xs text-gray-500 break-words">Container UUID: {{ area.containerUuid }}</p>
                </div>
            </div>
        </div>
        <footer class="flex justify-between items-center flex-col h-64 py-8 relative z-[2] mt-24"
            :style="{ backgroundColor: '#1C1C53' }">
            <h1 class="text-3xl font-black text-white text-center mb-8">CONTACT US</h1>
            <div class="flex w-full justify-center items-center px-8">
                <div class="flex gap-4 items-center w-full justify-center">
                    <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-white" />
                    <p class="text-white hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                </div>
                <p class="w-full text-center text-white">Project made under Epitech © PGE program</p>
                <h1 class="text-4xl font-black text-white text-center w-full hover:cursor-pointer" @click="scrollToTop">AREA</h1>
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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/user';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import ArrowComponentBottom from '@/components/ArrowComponentBottom.vue';
import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import ArrowComponentTop from '@/components/ArrowComponentTop.vue';

import { Area } from '@/types/area';

const userStore = useUserStore();
const router = useRouter();

const areas = ref<Area[]>(userStore.areas);

watch(() => userStore.areas, (newAreas) => {
    areas.value = newAreas;
});

const isHeroVisible = ref(true);

const scrollY = ref(0);

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

function copyEmail() {
    navigator.clipboard.writeText('contact.area.ownspace@gmail.com');
    alert('Email copied to clipboard');
}

const openServicePage = () => {
    console.log('Service page opened');
    isHeroVisible.value = false;
}

function handleBackButton() {
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
