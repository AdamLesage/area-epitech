<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';
import { Category, Item } from '@/types/services';
import { usePopupStore } from '@/stores/popup';
import { useUserStore } from '@/stores/users';

import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import CustomInput from '@/components/CustomInput.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const route = useRoute();
const router = useRouter();
const popupStore = usePopupStore();
const userStore = useUserStore();
const user = userStore.user;

const serviceId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const categoryId: string = Array.isArray(route.params.category) ? route.params.category[0] : route.params.category;
const cardId: string = Array.isArray(route.params.card) ? route.params.card[0] : route.params.card;
const isAction = ref<boolean>(route.params.type === 'action');

console.log('Is Action:', isAction);
const store = useServiceStore();
console.log('Service ID:', serviceId);
const service = ref(store.services.find(service => service.name === serviceId) || null);
console.log('Service:', service);
const category = ref(service.value?.categories.find(category => category.name === categoryId) || null);
console.log('Category:', category);
const card = ref<Item | null>(category.value?.actions.find(action => action.name === cardId) || category.value?.reactions.find(reaction => reaction.name === cardId) || null);
console.log('Card:', card);

if (!service.value) {
    console.error('Service not found');
    router.push('/dashboard');
}
if (!category.value) {
    console.error('Category not found');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    router.push(`/service/${serviceId}`);
}
if (!card.value) {
    console.error('Card not found');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    router.push(`/service/${serviceId}/category/${categoryId}`);
}

const exampleOptions = ref(card.value?.options.map(option => option.name) || []);
for (let i = 0; i < exampleOptions.value.length; i++) {
    exampleOptions.value[i] = '';
}

const color = ref<string>(service.value!.color);
const name = ref<string>(service.value!.name);
const logo = ref<string>(service.value!.icon);
const nbActions = ref<number>(0);
const nbReactions = ref<number>(0);
const categorySelected = ref<Category | null>(null);
const nameCapitalized = ref(name.value.toUpperCase());
const scrollY = ref(0);
const reload = ref(0);

if (service.value && service.value.categories) {
    categorySelected.value = service.value.categories[0];
    for (const category of service.value.categories) {
        console.log('Category:', category);
        nbActions.value += category.actions.length;
        nbReactions.value += category.reactions.length;
    }
} else {
    console.error('No categories found in service');
}

watch(() => route.params, (newRouteParams) => {
    const newServiceId: string = Array.isArray(newRouteParams.id) ? newRouteParams.id[0] : newRouteParams.id;
    const newCategoryId: string = Array.isArray(newRouteParams.category) ? newRouteParams.category[0] : newRouteParams.category;
    const newCardId: string = Array.isArray(newRouteParams.card) ? newRouteParams.card[0] : newRouteParams.card;
    const newIsAction: boolean = newRouteParams.type === 'action';

    if (newServiceId != service.value?.name) {
        console.log('Service ID changed:', newServiceId);
        service.value = store.services.find(service => service.name === newServiceId) || null;
        console.log('Service:', service);
        if (!service.value) {
            console.error('Service not found');
            router.push('/dashboard');
            return;
        }
        if (service.value.categories) {
            categorySelected.value = service.value.categories[0];
            for (const category of service.value.categories) {
                console.log('Category:', category);
                nbActions.value += category.actions.length;
                nbReactions.value += category.reactions.length;
            }
        }
        color.value = service.value.color;
        name.value = service.value.name;
        logo.value = service.value.icon;
        nameCapitalized.value = name.value.toUpperCase();
    }
    if (newCategoryId != category.value?.name) {
        console.log('Category ID changed:', newCategoryId);
        category.value = service.value?.categories.find(category => category.name === newCategoryId) || null;
        console.log('Category:', category);
        if (!category.value) {
            console.error('Category not found');
            router.push(`/service/${serviceId}`);
            return;
        }
    }
    if (newCardId != card.value?.name) {
        console.log('Card ID changed:', newCardId);
        card.value = category.value?.actions.find(action => action.name === newCardId) || category.value?.reactions.find(reaction => reaction.name === newCardId) || null;
        console.log('Card:', card);
        if (!card.value) {
            console.error('Card not found');
            router.push(`/service/${serviceId}/category/${categoryId}`);
            return;
        }
    }
    if (newIsAction != isAction.value) {
        console.log('Type changed:', newIsAction);
        console.log('Is Action:', newIsAction);
        isAction.value = newIsAction;
    }
    reload.value++;
});

function selectCard() {
    console.log('Selected card:', card);
    if (!card.value || !service.value || !category.value) return;
    popupStore.view = 'Normal';
    if (isAction.value) {
        popupStore.setAction(card.value, category.value, service.value);
    } else {
        popupStore.setReaction(card.value, category.value, service.value);
    }
}

function redirectToCategory() {
    console.log('Redirecting to category:', category.value!.name);
    window.scrollTo(0, 0);
    router.push(`/service/${serviceId}/category/${category.value!.name}`);
    window.scrollTo(0, 0);
}

function handleBackButtonFirstPage() {
    console.log('Back button clicked on first page');
    window.scrollTo(0, 0);
    router.push(`/service/${service.value!.name}?header=false`);
    window.scrollTo(0, 0);
}

function redirectToService() {
    console.log('Redirecting to service:', service.value!.name);
    window.scrollTo(0, 0);
    router.push(`/service/${service.value!.name}?header=false`);
    window.scrollTo(0, 0);
}

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})
</script>

<template>
    <div v-if="service && category && card" class="flex flex-col justify-between" :key="reload">
        <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-50"
            :style="{ backgroundColor: color }">
            <ServiceNavScrollComponent @back-button="handleBackButtonFirstPage"
                :logo="logo" :title="nameCapitalized"
                :redirect="true" />
        </div>

        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-36"
            v-if="service">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="redirectToService"/>
                <h1 class="text-3xl font-extrabold text-white mb-2">{{ category.display_name }}: {{ card.display_name }}</h1>
                <p class="text-lg text-white/80 text-center">
                    "{{ card.display_name }}" {{ isAction ? 'action' : 'reaction' }} is part of the {{ category.display_name }} category on {{ service.name.charAt(0).toUpperCase() + service.name.slice(1) }} service<br />
                    Below are the details of the {{ isAction ? 'action' : 'reaction' }}... 
                </p>
            </div>
            <div class="w-full flex justify-center mt-12">
                <button @click="selectCard" class="bg-[#333] p-4 w-[66.75rem] rounded-lg text-white text-xl font-black flex items-center justify-center gap-4"
                    v-if="user">
                    Use this {{ isAction ? 'Action' : 'Reaction' }}
                    <Icon icon="fluent:cursor-click-24-filled" class="w-8 h-8 text-white" />
                </button>
            </div>
            <div class="flex w-[66.75rem] flex-col mt-12">
                <div class="flex flex-col gap-1">
                    <h1 class="text-2xl font-extrabold text-[#333] mb-2">Details:</h1>
                    <p class="text-lg text-[#333] mb-4">This {{ isAction ? 'action' : 'reaction' }} is named "{{ card.display_name }}" and is part of the {{ category.display_name }} category on the {{ service.name.charAt(0).toUpperCase() + service.name.slice(1) }} service</p>
                    <div class="flex justify-start gap-2 items-center hover:bg-gray-50 rounded-lg ml-7">
                        <span class="h-28 w-1.5 rounded-md" :style="{ backgroundColor: service.color }" />
                        <div class="flex flex-col w-full">
                            <p class="text-lg text-[#333]"><strong>Description:</strong> {{ card.description }}</p>
                            <p class="text-lg text-[#333]"><strong>Release Date:</strong> {{ card.release_date }}</p>
                            <p class="text-lg text-[#333]"><strong>Last Update:</strong> {{ card.updated_date }}</p>
                            <p class="text-lg text-[#333]"><strong>Version:</strong> {{ card.version }}</p>
                        </div>
                    </div>
                </div>
                <h1 class="text-xl font-black text-start w-full rounded-lg text-[#333] mt-12 mb-4">Category:</h1>
                <div class="flex justify-start flex-wrap w-full gap-4">
                    <div class="gap-4 px-4 py-1 rounded-md hover:cursor-pointer ml-4" :style="{ backgroundColor: service.color }" @click="redirectToCategory">
                        <h1 class="text-lg font-semibold text-start w-full rounded-lg text-white">{{ category.display_name }}</h1>
                    </div>
                </div>
                <div class="flex flex-col gap-4 mt-12">
                    <h1 class="text-2xl font-extrabold text-[#333]">Options:</h1>
                    <div class="flex justify-center w-full items-center">
                        <div class="flex flex-wrap gap-8 w-full">
                            <div v-for="option in card.options" :key="option.name" class="flex flex-col gap-2 p-4 rounded-lg w-[20.917rem]"
                                :style="{ backgroundColor: service.color }">
                                <h1 class="text-lg font-black text-white break-words">{{ option.name }}</h1>
                                <p class="text-white break-words">Description: {{ option.description }}</p>
                                <p class="text-white break-words">Type: {{ option.type }}</p>
                                <div class="flex justify-start items-center">
                                    <p class="text-white">Is {{ option.required ? 'Required' : 'Optional' }}</p>
                                    <Icon icon="mdi:required"
                                        :class="{ 'text-gray-500': !option.required, 'text-red-500': option.required }"
                                        class="w-6 h-6 ml-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 class="text-2xl font-extrabold text-[#333] mt-12">Example:</h1>
                <div class="flex gap-12 w-full justify-between">
                    <div class="flex flex-col gap-4 w-1/3">
                        <div class="flex flex-col w-full gap-2">
                            <h1 class="text-lg font-black text-[#333] mb-2">{{ card.display_name }}:</h1>
                            <CustomInput v-for="(option, index) in card.options" :key="option.name" :type="option.type" :name="option.display_name" class="ml-4" value=""
                                @change="exampleOptions[index] = $event.target.value" />
                        </div>
                    </div>
                    <div class="flex flex-col justify-start w-2/3">
                        <h1 class="text-lg font-black text-[#333]">{{ isAction ? 'When' : 'Then' }} {{ card.description.toLowerCase() }} on {{ service.name.charAt(0).toUpperCase() + service.name.slice(1) }}</h1>
                        <ul>
                            <li v-for="(option, index) in card.options" :key="option.name">
                                <p class="text-lg font-black text-[#333] break-words">• {{ isAction ? (index == 0 ? 'where:' : 'and where:') : (index == 0 ? 'with' : 'and with') }} <span class="bg-gray-200">{{ option.display_name.toLowerCase() }}</span> {{ isAction ? 'is' : 'as' }} "<span class="underline decoration-2">{{ exampleOptions[index] }}</span>"</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full flex justify-center mt-12">
            <button @click="selectCard" class="bg-[#333] p-4 w-[66.75rem] rounded-lg text-white text-xl font-black flex items-center justify-center gap-4"
                v-if="user">
                Use this {{ isAction ? 'Action' : 'Reaction' }}
                <Icon icon="fluent:cursor-click-24-filled" class="w-8 h-8 text-white" />
            </button>
        </div>
        <FooterComponent />
    </div>
</template>
