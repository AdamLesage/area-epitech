<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';
import { Category } from '@/types/services';

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
const categoryId: string = Array.isArray(route.params.category) ? route.params.category[0] : route.params.category;

const store = useServiceStore();
console.log('Service ID:', serviceId);
const service = store.services.find(service => service.name === serviceId) || null;
console.log('Service:', service);
const category = service?.categories.find(category => category.name === categoryId) || null;

if (!service) {
    console.error('Service not found');
    router.push('/dashboard');
}
if (!category) {
    console.error('Category not found');
    router.push(`/service/${serviceId}`);
}

type Mode = 'Actions' | 'Reactions' | 'Both';

const color = ref<string>(service!.color);
const name = ref<string>(service!.name);
const logo = ref<string>(service!.icon);
const rate = ref<number>(service!.reviews.rate);
const reviews = ref<number>(service!.reviews.count);
const saves = ref<number>(service!.saves);
const isActivated = ref<boolean>(true);
const nbActions = ref<number>(0);
const nbReactions = ref<number>(0);
const currentSlide = ref<number>(0);
const categorySelected = ref<Category | null>(null);
const modeSelected = ref<Mode>('Both');
const search = ref<string>('');

function prevSlide() {
    currentSlide.value = (currentSlide.value - 1 + service!.categories.length) % service!.categories.length;
    categorySelected.value = service!.categories[currentSlide.value];
}

function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % service!.categories.length;
    categorySelected.value = service!.categories[currentSlide.value];
}

const view = ref<string>('both');

function switchView(newView: string) {
    console.log('Switching view to:', newView);
    view.value = newView;
}

if (service && service.categories) {
    categorySelected.value = service.categories[0];
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

function scrollToAllApps() {
    const element = document.getElementById('all-aps');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToCategories() {
    const element = document.getElementById('categories');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

const sortedItems = computed(() => {
    if (modeSelected.value === 'Actions' && category?.actions) {
        return category.actions.filter(action => action.name.toLowerCase().includes(search.value.toLowerCase()) || action.description.toLowerCase().includes(search.value.toLowerCase()));
    } else if (modeSelected.value === 'Reactions' && category?.reactions) {
        return category.reactions.filter(reaction => reaction.name.toLowerCase().includes(search.value.toLowerCase()) || reaction.description.toLowerCase().includes(search.value.toLowerCase()));
    } else if (modeSelected.value === 'Both' && category) {
        const filteredActions = category.actions?.filter(action => action.name.toLowerCase().includes(search.value.toLowerCase()) || action.description.toLowerCase().includes(search.value.toLowerCase())) || [];
        const filteredReactions = category.reactions?.filter(reaction => reaction.name.toLowerCase().includes(search.value.toLowerCase()) || reaction.description.toLowerCase().includes(search.value.toLowerCase())) || [];
        return [...filteredActions, ...filteredReactions];
    } else {
        return [];
    }
});
</script>

<template>
    <!-- Second Page -->
    <div v-if="category" class="flex flex-col justify-between">
        <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-50"
            :style="{ backgroundColor: color }">
            <ServiceNavScrollComponent @back-button="handleBackButtonFirstPage"
                :logo="logo" :title="nameCapitalized" />
        </div>

        <!-- All Apps -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-36"
            v-if="service">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white" />
                <h1 class="text-3xl font-extrabold text-white mb-2">{{ category.display_name }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Check every app the {{ category.display_name }} category has to offer...<br />
                    Click on a card to see more details.
                </p>
            </div>
            <div class="flex justify-between w-[66.75rem] mt-6 relative">
                <div class="flex gap-2">
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Actions' ? service!.color : '#fff',
                            color: modeSelected == 'Actions' ? 'white' : '#333'
                         }"
                        @click="modeSelected = 'Actions'">
                        <h1 class="text-lg font-semibold">Actions</h1>
                    </button>
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Reactions' ? service!.color : '#fff',
                            color: modeSelected == 'Reactions' ? 'white' : '#333' }"
                        @click="modeSelected = 'Reactions'">
                        <h1 class="text-lg font-semibold">Reactions</h1>
                    </button>
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Both' ? service!.color : '#fff',
                            color: modeSelected == 'Both' ? 'white' : '#333' }"
                        @click="modeSelected = 'Both'">
                        <h1 class="text-lg font-semibold">Both</h1>
                    </button>
                </div>
                <input type="search" v-model="search" class="border-2 border-[#999] pl-4 pr-10 rounded-md mr-[2px]" placeholder="Search . . .">
                <Icon class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" icon="akar-icons:search" />
            </div>
            <div
                class="flex justify-center w-[66.75rem] gap-6 mt-6">
                <div class="flex items-center gap-4 mt-6">
                    <div class="flex flex-wrap gap-6 w-full" v-if="sortedItems.length > 0">
                        <AREAInfoComponent
                            v-for="item in sortedItems"
                            :key="item.name"
                            :object="item"
                            :color="service.color"/>
                    </div>
                    <div class="flex flex-wrap gap-6 w-full" v-else>
                        <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1 text-[#333]">No results found</h1>
                    </div>
                </div>
            </div>
        </div>

        <footer class="flex justify-between items-center flex-col h-64 py-8 mt-24" :style="{ backgroundColor: '#333' }">
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
