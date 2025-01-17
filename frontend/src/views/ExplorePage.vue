<template>
    <div class="text-white font-sans min-h-screen h-full flex flex-col">
        <HelpAssistantPopupComponent :bottom="8" :left="8" :color="displayedService.color" class="z-[60] mobile:hidden" v-if="displayedService"/>
        <HelpAssistantPopupComponent :bottom="108" :left="8" :color="displayedService.color" class="z-[60] web:hidden" v-if="displayedService"/>
        <div
            v-if="displayedService"
            @click.stop.prevent="freezeTime = !freezeTime"
            class="fixed w-screen h-screen top-0 !z-40 select-none pointer-events-none !bg-transparent">
            <div class="fixed z-50 mobile:!bottom-[170px] half:bottom-[75px] bottom-[90px] left-[8px] flex justify-center items-center">
                <div
                    class="p-2 half:p-1 rounded-full pointer-events-auto relative group"
                    :style="{ backgroundColor: displayedService.color }">
                    <Icon
                        icon="mdi:snowflake"
                        class="text-white w-12 h-12 half:w-10 half:h-10"
                        aria-label="Open Help Popup"
                        role="button"
                        tabindex="0" />
                    <p class="font-bold -top-2 right-0 absolute text-xl">{{ secondsBeforeSwitch }}</p>
                </div>
            </div>
        </div>
        <div class="flex flex-col fixed w-full items-center justify-between h-fit z-10 mobile:hidden">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" v-if="scrollY === 0" />
            <ServiceNavScrollComponent @back-button="handleBackButton" class="z-10" v-else-if="displayedService"
                :style="{ backgroundColor: displayedService.color }"
                logo="material-symbols:explore-rounded" title="Explore" :redirect="false" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden fixed bottom-0 z-40"
            v-if="displayedService"
            :style="{ backgroundColor: getModifiedColor(displayedService.color, 15)}" />
        <!-- Main Content -->
        <div v-if="displayedService" class="w-full h-full overflow-y-scroll flex flex-col justify-start"
            id="main-content">
            <div
                :key="displayedService.name"
                class="flex flex-col items-center justify-between w-full h-full z-[2] shadow-lg select-none cursor-default"
                :style="{ backgroundColor: displayedService.color }"
                :aria-label="`Explore ${displayedService.name}`"
                tabindex="0">
                <div class="items-center w-1/3 justify-center gap-2 mobile:flex hidden my-8">
                    <Icon icon="material-symbols:explore-rounded" class="w-[2.5rem] h-[2.5rem] flex-shrink-0 text-white hover:cursor-pointer"/>
                    <div class="flex flex-col justify-end items-center">
                        <h1 class="text-white text-[2rem] leading-3 font-bold hover:cursor-pointer select-none">Explore</h1>
                    </div>
                </div>
                <div class="w-full h-full flex half:justify-start web:justify-center gap-8 half:flex-col items-center overflow-y-scroll web:mt-24 web:pb-16 half:pb-0 web:pt-4 half:pt-0"
                    @scroll="updateScrollY">
                    <div class="flex items-center bg-black/20 w-[22rem] half:w-11/12 h-full half:!h-fit rounded-lg flex-col p-8 justify-between px-8 half:px-4">
                        <div class="flex flex-col items-center hover:cursor-pointer"
                            @click="handleServiceClick(displayedService.name)">
                            <Icon :icon="displayedService.icon" class="text-4xl w-32 half:w-24 h-32 half:h-24 text-white" aria-hidden="true" />
                            <span class="text-2xl mobile:text-xl font-bold text-white select-none capitalize">{{ displayedService.name }}</span>
                        </div>
                        <div class="flex flex-col justify-center w-full items-center text-center gap-4 -mt-4 half:mt-0" v-if="userStore.user">
                            <h1 class="text-md mobile:text-sm font-black text-white" v-if="!linked">You need to connect to <span class="capitalize">{{ displayedService.name }}</span> in order to have access to this action.</h1>
                            <h1 class="text-md font-black text-white" v-else>You are correctly linked to <span class="capitalize">{{ displayedService.name }}</span>.</h1>
                            <div class="flex w-full items-center justify-center half:mb-2">
                                <div
                                    class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 transition-transform duration-300">
                                    <div
                                        v-if="linked"
                                        class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                        :style="{ backgroundColor: displayedService.color }" />
                                    <h1
                                        class="text-xl mobile:text-lg font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                        :style="{ color: displayedService.color, textAlign: linked ? 'left' : 'right' }">
                                        {{ linked ? 'Linked' : 'Not Linked' }}
                                    </h1>
                                    <div
                                        v-if="!linked"
                                        class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                        :style="{ backgroundColor: displayedService.color }" />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 items-center justify-center text-center" v-else>
                            <h1 class="text-md font-black text-white">Login to start using this AmAzIng service!</h1>
                        </div>
                        <button
                            aria-label="redirect-to-service-button"
                            @click="handleServiceClick(displayedService.name)"
                            class="btn btn-primary px-12 py-4 text-white bg-white rounded-lg transition hover:cursor-pointer half:my-4 mobile:px-4 mobile:py-2"
                            :style="{ backgroundColor: displayedService.color }">
                            <span class="text-xl mobile:!text-base font-bold">Go to <span class="capitalize">{{ displayedService.name }}</span></span>
                        </button>
                        <div class="flex flex-col gap-2 items-center">
                            <RateComponent :rate="displayedService.reviews.rate" :reviews="displayedService.reviews.count" textcolor="white" color="white" />
                            <SaveComponent :saves="displayedService.saves" textcolor="white" color="white" />
                        </div>
                    </div>
                    <div class="flex justify-start flex-col half:px-4 py-4 half:py-4 pb-12 items-center bg-black/20 w-[59%] half:w-11/12 half:h-fit h-full rounded-lg mobile:!mb-8 half:mb-16 px-8 flex-shrink-0">
                        <div class="flex gap-2 items-center mb-4 half:hidden hover:cursor-pointer"
                            @click="handleServiceClick(displayedService.name)">
                            <Icon :icon="displayedService.icon" class="text-4xl w-16 h-16 mb-2 text-white" aria-hidden="true" />
                            <span class="text-xl font-bold text-white select-none capitalize">{{ displayedService.name }}</span>
                        </div>
                        <div class="flex flex-wrap gap-4 overflow-y-scroll w-fit">
                            <div class="flex flex-wrap gap-6 half:gap-2 w-fit justify-center" v-if="sortedCategories.length > 0">
                                <AREAInfoComponent
                                    v-for="item in sortedCategories"
                                    :key="item.name"
                                    :object="item"
                                    :color="displayedService.color"
                                    class="hover:cursor-pointer half:scale-90"
                                    @click.stop="redirectToCard(null, item.name)" />
                            </div>
                            <div class="flex flex-wrap gap-6 w-full" v-else>
                                <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1 text-[#333]">
                                    No results found</h1>
                            </div>
                        </div>
                    </div>
                    <footer class="flex justify-between items-center flex-col h-64 half:!h-fit py-8 relative z-[2] w-full bg-black/20 web:hidden half:flex" v-if="displayedService">
                        <h1 class="text-3xl font-black text-white text-center mb-8">CONTACT US</h1>
                        <div class="flex half:flex-col w-full justify-center items-center px-8">
                            <div class="flex gap-4 items-center w-full justify-center">
                                <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-white" />
                                <p class="text-white hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                            </div>
                            <p class="w-full text-center text-white">Project made at Epitech</p>
                            <h1 class="text-4xl font-black text-white text-center w-full hover:cursor-pointer half:mt-12" @click="scrollToTop">AREA</h1>
                        </div>
                        <div class="flex justify-center items-center gap-8 mt-8 text-white/60 text-sm mobile:mb-20">
                            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/mentions')">Mentions</p>
                            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/cookies')">Cookies</p>
                            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/privacy')">Privacy</p>
                            <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/terms')">Terms</p>
                        </div>
                    </footer>
                </div>
            </div>
            <div class="flex justify-between items-center flex-col h-64 w-full half:!h-fit"
                :style="{ backgroundColor: displayedService.color }">
                <footer class="flex justify-between items-center flex-col h-64 half:!h-fit py-8 relative z-[2] w-full bg-black/20 !mt-0 half:hidden" v-if="displayedService">
                    <h1 class="text-3xl font-black text-white text-center mb-8">CONTACT US</h1>
                    <div class="flex half:flex-col w-full justify-center items-center px-8">
                        <div class="flex gap-4 items-center w-full justify-center">
                            <Icon icon="material-symbols:mail-outline" class="w-6 h-6 text-white" />
                            <p class="text-white hover:cursor-pointer" @click="copyEmail">contact.area.ownspace@gmail.com</p>
                        </div>
                        <p class="w-full text-center text-white">Project made at Epitech</p>
                        <h1 class="text-4xl font-black text-white text-center w-full hover:cursor-pointer half:mt-12" @click="scrollToTop">AREA</h1>
                    </div>
                    <div class="flex justify-center items-center gap-8 mt-8 text-white/60 text-sm mobile:mb-20">
                        <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/mentions')">Mentions</p>
                        <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/cookies')">Cookies</p>
                        <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/privacy')">Privacy</p>
                        <p class="hover:underline hover:cursor-pointer" @click="navigateTo('/terms')">Terms</p>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
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
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

// Store and Router Initialization
const serviceStore = useServiceStore();
const userStore = useUserStore();
const router = useRouter();

const services = ref<Service[]>(serviceStore.services);
const displayedService = ref<Service | null>(null);
const secondsBeforeSwitch = ref(10);
const freezeTime = ref(false);
const scrollY = ref(0);

// Method to update scrollY ref
const updateScrollY = (event: Event) => {
  const target = event.target as HTMLElement;
  scrollY.value = target.scrollTop;
};

function navigateTo(path: string) {
    router.push(path);
}

const intervalDuration = 1000;

const linked = ref(false);

const interval = ref<NodeJS.Timeout | null>(null);

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

function getModifiedColor(color: string, percent: number = 10): string {
  // Remove the hash if present
  color = color.replace(/^#/, '');

  // Parse the color into its RGB components
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Lighten each component
  r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));

  // Convert back to hexadecimal and return the color
  const lighterColor = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return lighterColor;
}

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

onUnmounted(() => {
    clearInterval(interval.value!);
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