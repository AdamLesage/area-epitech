<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';
import { Category } from '@/types/services';

import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

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
const nbActions = ref<number>(0);
const nbReactions = ref<number>(0);
const categorySelected = ref<Category | null>(null);
const modeSelected = ref<Mode>('Both');
const search = ref<string>('');
const nameCapitalized = ref(name.value.toUpperCase());
const scrollY = ref(0);

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

function handleBackButton() {
    console.log('Back button clicked on first page');
    window.scrollTo(0, 0);
    router.push(`/service/${service!.name}?header=false`);
    window.scrollTo(0, 0);
}

function redirectToCard(cardName: string) {
    console.log('Redirecting to card:', cardName, ' from category:', category!.name);
    if (!category)
        return;
    const card = category.actions.find(action => action.name === cardName) || category.reactions.find(reaction => reaction.name === cardName);
    const isAction = category.actions.find(action => action.name === cardName) ? true : false;
    if (!card)
        return;
    window.scrollTo(0, 0);
    router.push(`/service/${serviceId}/category/${category.name}/${ isAction ? 'action' : 'reaction' }/${card.name}`);
    window.scrollTo(0, 0);
}

function redirectToService() {
    console.log('Redirecting to service:', service!.name);
    window.scrollTo(0, 0);
    router.push(`/service/${service!.name}?header=false`);
    window.scrollTo(0, 0);
}

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})
</script>

<template>
    <div v-if="category" class="flex flex-col justify-between">
        <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-50"
            :style="{ backgroundColor: color }">
            <ServiceNavScrollComponent @back-button="handleBackButton"
                :logo="logo" :title="nameCapitalized"
                :redirect="true" />
        </div>

        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-36"
            v-if="service">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="redirectToService"/>
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
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(item.name)"/>
                    </div>
                    <div class="flex flex-wrap gap-6 w-full" v-else>
                        <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1 text-[#333]">No results found</h1>
                    </div>
                </div>
            </div>
        </div>
        <FooterComponent />
    </div>
</template>
