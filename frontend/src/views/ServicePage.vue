<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { AreaValues } from '@/types/services';
import { Icon } from '@iconify/vue';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import SaveComponent from '@/components/SaveComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';

const route = useRoute();

const serviceId = route.params.id;
const color = ref<string>('#24292E');
const name = ref<string>('Github');
const logo = ref<string>('mdi:github');
const rate = ref<number>(3.4);
const reviews = ref<number>(10000);
const saves = ref<number>(50);
const isActivated = ref<boolean>(true);
const nbActions = ref<number>(5);
const nbTriggers = ref<number>(3);
const nameCapitalized = ref(name.value.toUpperCase());
const isHeroVisible = ref(true);

const areas = ref<AreaValues[]>([
    {
        title: 'On Mail Received',
        subtitle: 'When you receive an email',
        description: 'This trigger gets called when you receive an email in your mailbox.',
        status: true,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    },
    {
        title: 'On New Tweet',
        subtitle: 'When a new tweet is posted',
        description: 'This trigger gets called when a new tweet is posted by a user.',
        status: false,
    }
])

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

function handleMenuClick(area: AreaValues) {
    console.log('Menu clicked on:', area.title);
}

function handleMoreClick(area: AreaValues) {
    console.log('More clicked on:', area.title);
}

function handleConfigureClick(area: AreaValues) {
    console.log('Configure clicked on:', area.title);
}
</script>

<template>
    <!-- First Page -->
    <div
        :style="{ backgroundColor: color }"
        class="flex flex-col justify-between"
        @click="openServicePage"
        v-if="isHeroVisible">
        <ServiceNavComponent />
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
    <div v-else>
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
        <div class="flex flex-wrap gap-8 p-8 justify-center">
            <AREAInfoComponent
                v-for="area in areas"
                :key="area.title"
                :values="area"
                :icon="logo"
                :color="color"
                @menu-click="handleMenuClick(area)"
                @more-click="handleMoreClick(area)"
                @configure-click="handleConfigureClick(area)" />
        </div>
    </div>
</template>
