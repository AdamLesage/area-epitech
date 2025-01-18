<template>
    <RouterView class="w-screen h-screen"/>
    <CreateAREAPopupComponent
        :action="actionSelected"
        :reaction="reactionSelected"
        :title="popupStore.title"
        :view="popupView"
        @remove-action="popupStore.action = null"
        @remove-reaction="popupStore.reaction = null"
        @create="handleCreate"
        @change-title="popupStore.title = $event"
        @change-view="popupStore.view = $event"
        v-if="(actionSelected || reactionSelected || popupStore.title) && displayPopup" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { Action, Reaction, Category, Service } from './types/services';

import { usePopupStore } from './stores/popup';
import { useUserStore } from './stores/user';
import { useServiceStore } from './stores/service';

import CreateAREAPopupComponent from './components/CreateAREAPopupComponent.vue';

import Cookies from 'js-cookie';

import { fetchServices } from '@/logic/services';
import { fetchUser, fetchUserAreas } from '@/logic/user';

// State
const router = useRouter();
const route = useRoute();

const popupStore = usePopupStore();
const userStore = useUserStore();
const servicesStore = useServiceStore();

const actionSelected = ref<{
    card: Action,
    category: Category,
    service: Service
} | null>(popupStore.action);
const reactionSelected = ref<{
    card: Reaction,
    category: Category,
    service: Service
} | null>(popupStore.reaction);
const popupView = ref<'Extended' | 'Normal' | 'Minimal'>('Normal');

const displayPopup = ref<boolean>(popupStore.display);
const tempHide = ref<boolean>(false);

// Watch the popupStore for changes and update the local variables
watch(() => {
    return {
        view: popupStore.view,
        action: popupStore.action,
        reaction: popupStore.reaction,
        display: popupStore.display
    };
}, (newValues) => {
    popupView.value = newValues.view;
    actionSelected.value = newValues.action;
    reactionSelected.value = newValues.reaction;
    displayPopup.value = newValues.display;
});

/**
 * Function to handle the creation of an AREA.
 * We redirect the user to the workshop page and hide the popup.
 */
function handleCreate() {
    console.log('Creating AREA:', popupStore.title, 'with action:',
        actionSelected.value, 'and reaction:', reactionSelected.value);
    popupStore.display = false;
    window.scrollTo(0, 0);
    router.push('/workshop');
    window.scrollTo(0, 0);
}

// Watches the route for changes and initializes the stores if necessary
watch(async () => route.fullPath, async (newPath) => {
    if (await newPath === '/' ||
        await newPath === '/terms' ||
        await newPath === '/cookies' ||
        await newPath === '/privacy' ||
        await newPath === '/mentions') {
        popupStore.display = false;
        tempHide.value = true;
        await initStores();
        return;
    }
    if (tempHide.value) {
        tempHide.value = false;
        popupStore.display = true;
        await initStores();
        return;
    }
    await initStores();
})

/**
 * Initializes the stores.
 * 
 * @returns {Promise<void>} A promise that resolves when the stores are initialized.
 */
async function initStores(): Promise<void> {
    const token = Cookies.get('token');
    console.log('Token:', token);

    if (!userStore.user) {
        const user = await fetchUser(token);
        if (!user) {
            console.log('No user found');
        } else {
            userStore.setUser(user);
            userStore.areas = [];
        }
    }
    if (userStore.user) {
        if (userStore.areas.length === 0) {
            const areas = await fetchUserAreas(token);
            for (const area of areas) {
                userStore.addArea(area);
            }
        }
    }
    if (servicesStore.services.length === 0) {
        const services = await fetchServices();
        for (const service of services) {
            servicesStore.addService(service);
        }
    }
}
</script>
