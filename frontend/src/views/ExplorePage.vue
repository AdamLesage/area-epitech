<template>
    <div class="text-white font-sans h-screen flex flex-col">
        <HelpAssistantPopupComponent :bottom="16" :left="16" :color="displayedService.color" class="z-50" v-if="displayedService" />
        <div class="flex flex-col items-center justify-between web:h-1/4 mobile:h-full">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
            <div class="flex justify-center items-center p-4 mobile:hidden z-10">
                <Icon icon="material-symbols:explore-rounded" class="w-28 h-28 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[3rem] leading-[2.5rem] font-bold">EXPLORE</h1>
                    <h2 class="text-white text-md font-medium text-right w-full pr-2 mobile:hidden">
                        Unleash endless potential
                    </h2>
                </div>
            </div>
            <div />
        </div>
        <!-- Main Content -->
        <div v-if="displayedService" class="absolute w-full h-full">
            <div
                :key="displayedService.name"
                class="flex flex-col items-center justify-center w-full h-full z-[2] shadow-lg absolute select-none transform"
                :style="{ backgroundColor: displayedService.color }"
                :aria-label="`Explore ${displayedService.name}`"
                role="button"
                tabindex="0"
                @click="handleServiceClick(displayedService.name)">
                <div class="w-full h-3/4 absolute bottom-0 pt-8 pb-24 flex justify-center gap-8">
                    <div class="flex height-adjusted items-center absolute right-0 z-30 w-[5.5%] flex-col justify-center">
                        <ArrowComponent direction="right" :animate="false" color="white" class="w-8 h-8 text-white p-1 rounded-full hover:bg-black/20"
                            @click.stop="nextSlide"/>
                    </div>
                    <div class="flex height-adjusted items-center absolute left-0 z-30 w-[5.5%] flex-col justify-center">
                        <ArrowComponent direction="left" :animate="false" color="white" class="w-8 h-8 text-white p-1 rounded-full hover:bg-black/20"
                            @click.stop="prevSlide"/>
                    </div>
                    <div class="flex items-center bg-black/20 w-1/5 rounded-lg flex-col p-8 justify-between">
                        <div class="flex flex-col items-center">
                            <Icon :icon="displayedService.icon" class="text-4xl w-32 h-32 text-white" aria-hidden="true" />
                            <span class="text-2xl font-bold text-white select-none capitalize">{{ displayedService.name }}</span>
                        </div>
                        <div class="flex flex-col justify-center w-full items-center text-center gap-4 -mt-4" v-if="userStore.user">
                            <h1 class="text-md font-black text-white" v-if="!linked">You need to connect to <span class="capitalize">{{ displayedService.name }}</span> in order to have access to this action.</h1>
                            <h1 class="text-md font-black text-white" v-else>You are correctly linked to <span class="capitalize">{{ displayedService.name }}</span>.</h1>
                            <div class="flex w-full items-center justify-center">
                                <div
                                    class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 cursor-pointer transition-transform duration-300"
                                    @click.stop="switchLinkStatus">
                                    <div
                                        v-if="!linked"
                                        class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                        :style="{ backgroundColor: displayedService.color }" />
                                    <h1
                                        class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                        :style="{ color: displayedService.color, textAlign: !linked ? 'left' : 'right' }">
                                        {{ !linked ? 'Not Linked' : 'Linked' }}
                                    </h1>
                                    <div
                                        v-if="linked"
                                        class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                        :style="{ backgroundColor: displayedService.color }" />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 items-center justify-center text-center" v-else>
                            <h1 class="text-md font-black text-white">Login to start using this AmAzIng service!</h1>
                        </div>
                        <div class="flex flex-col gap-2 items-center">
                            <RateComponent :rate="displayedService.reviews.rate" :reviews="displayedService.reviews.count" textcolor="white" color="white" />
                            <SaveComponent :saves="displayedService.saves" textcolor="white" color="white" />
                        </div>
                    </div>
                    <div class="flex justify-start flex-col p-8 items-center bg-black/20 w-2/3 rounded-lg">
                        <div class="flex gap-2 items-center mb-4">
                            <Icon :icon="displayedService.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                            <span class="text-xl font-bold text-white select-none capitalize">{{ displayedService.name }}</span>
                        </div>
                        <div class="flex flex-wrap gap-4 overflow-y-scroll w-full">
                            <div class="flex flex-wrap gap-6 w-full justify-center" v-if="sortedCategories.length > 0">
                                <AREAInfoComponent
                                    v-for="item in sortedCategories"
                                    :key="item.name"
                                    :object="item"
                                    :color="displayedService.color"
                                    class="hover:cursor-pointer"
                                    @click.stop="redirectToCard(null, item.name)" />
                            </div>
                            <div class="flex flex-wrap gap-6 w-full" v-else>
                                <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1 text-[#333]">
                                    No results found</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex absolute bottom-0 z-20 w-full justify-center items-center">
            <h2 class="text-white text-lg font-medium text-center p-4 mobile:hidden">
                Switching in {{ secondsBeforeSwitch }} seconds . . .
            </h2>
            <Icon icon="mdi:snowflake" class="w-8 h-8 text-white" />
            <p class="text-white text-lg font-medium text-center mobile:hidden pl-2 underline hover:cursor-pointer" @click.stop="freezeTime = !freezeTime" >
                Click to {{ freezeTime ? 'un' : '' }}freeze
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Service } from '@/types/services';
import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue';

import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import SaveComponent from '@/components/SaveComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';

// Store and Router Initialization
const serviceStore = useServiceStore();
const userStore = useUserStore();
const router = useRouter();

const services = ref<Service[]>(serviceStore.services);
const displayedService = ref<Service | null>(null);
const secondsBeforeSwitch = ref(10);
const freezeTime = ref(false);

const intervalDuration = 1000;

const linked = ref(false);

const interval = ref<NodeJS.Timeout | null>(null);

const sortedCategories = computed(() => {
    if (!displayedService.value) {
        return [];
    }
    const allCategories = [];
    for (const category of displayedService.value.categories) {
        const filteredActions = [];
        const filteredReactions = [];
        if (category.actions)
            filteredActions.push(...category.actions);
        if (category.reactions)
            filteredReactions.push(...category.reactions);
        allCategories.push(...filteredActions, ...filteredReactions);
    }
    return allCategories;
});

function redirectToCard(categoryName: string | null, cardName: string) {
    if (!displayedService.value) {
        console.error('No service found');
        return;
    }
    let category = null;
    if (!categoryName) {
        category = displayedService.value.categories.find(category => category.actions.find(action => action.name === cardName) || category.reactions.find(reaction => reaction.name === cardName));
    } else
        category = displayedService.value.categories.find(category => category.name === categoryName);
    console.log('Redirecting to card:', cardName, ' from category:', categoryName);
    if (category) {
        const card = category.actions.find(action => action.name === cardName) || category.reactions.find(reaction => reaction.name === cardName);
        const isAction = category.actions.find(action => action.name === cardName) ? true : false;
        if (card) {
            window.scrollTo(0, 0);
            if (isAction)
                router.push(`/service/${displayedService.value.name}/category/${category.name}/action/${card.name}`);
            else
                router.push(`/service/${displayedService.value.name}/category/${category.name}/reaction/${card.name}`);
        }
    }
}

function switchLinkStatus() {
    console.log('Switching link status');
    linked.value = !linked.value;
}

function handleBackButton() {
    if (!userStore.user) {
        router.push('/');
        return;
    }
    router.push('/dashboard');
}

function startAnimation() {
    console.log('Starting animation');
    if (services.value.length === 0) {
        setTimeout(() => {
            startAnimation();
        }, 500);
        console.error('No services found');
        return;
    }
    displayedService.value = services.value[0];

    const user = userStore.user;
    if (user) {
        const linkedAccounts = user.linkedAccounts;
        if (linkedAccounts && linkedAccounts.find(account => account.serviceName === displayedService.value!.name)) {
            linked.value = true;
        } else {
            linked.value = false;
        }
    }

    // display new service after 10 seconds
    secondsBeforeSwitch.value = 10;
    interval.value = setInterval(() => {
        if (freezeTime.value === true)
            return;
        if (secondsBeforeSwitch.value > 0) {
            secondsBeforeSwitch.value--;
        } else {
            clearInterval(interval.value!);
            displayNewService();
        }
    }, intervalDuration);
}

function nextSlide() {
    clearInterval(interval.value!);
    displayNewService();
    return;
}

function prevSlide() {
    clearInterval(interval.value!);
    displayPreviousService();
    return;
}

// display previous then next service after 10 seconds
function displayPreviousService() {
    console.log('Displaying new service');
    secondsBeforeSwitch.value = 10;
    const index = services.value.indexOf(displayedService.value!);
    if (index === -1) {
        console.error('Service not found');
        startAnimation();
        return;
    }
    const newIndex = (index - 1) % services.value.length;
    if (newIndex < 0) {
        displayedService.value = services.value[services.value.length - 1];
    } else {
        displayedService.value = services.value[newIndex];
    }

    const user = userStore.user;
    if (user) {
        const linkedAccounts = user.linkedAccounts;
        if (linkedAccounts && linkedAccounts.find(account => account.serviceName === displayedService.value!.name)) {
            linked.value = true;
        } else {
            linked.value = false;
        }
    }

    interval.value = setInterval(() => {
        if (freezeTime.value === true)
            return;
        if (secondsBeforeSwitch.value > 0) {
            secondsBeforeSwitch.value--;
        } else {
            clearInterval(interval.value!);
            displayNewService();
        }
    }, intervalDuration);
}

function displayNewService() {
    console.log('Displaying new service');
    secondsBeforeSwitch.value = 10;
    const index = services.value.indexOf(displayedService.value!);
    if (index === -1) {
        console.error('Service not found');
        startAnimation();
        return;
    }
    const newIndex = (index + 1) % services.value.length;
    displayedService.value = services.value[newIndex];

    const user = userStore.user;
    if (user) {
        const linkedAccounts = user.linkedAccounts;
        if (linkedAccounts && linkedAccounts.find(account => account.serviceName === displayedService.value!.name)) {
            linked.value = true;
        } else {
            linked.value = false;
        }
    }

    interval.value = setInterval(() => {
        if (freezeTime.value === true)
            return;
        if (secondsBeforeSwitch.value > 0) {
            secondsBeforeSwitch.value--;
        } else {
            clearInterval(interval.value!);
            displayNewService();
        }
    }, intervalDuration);
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

onMounted(() => {
    startAnimation();
});
</script>

<style scoped>
.custom-top-val {
    top: 50%;
    transform: translateY(calc(-50% - 35px));
}
.height-adjusted {
    height: calc(100% - 8rem);
}
</style>