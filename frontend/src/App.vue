<script setup lang="ts">
import CreateAREAPopupComponent from './components/CreateAREAPopupComponent.vue';
import { usePopupStore } from './stores/popup';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Action, Reaction, Category, Service } from './types/services';

const store = usePopupStore();
const router = useRouter();

const actionSelected = ref<{
    card: Action,
    category: Category,
    service: Service
} | null>(store.action);
const reactionSelected = ref<{
    card: Reaction,
    category: Category,
    service: Service
} | null>(store.reaction);
const displayPopup = ref<boolean>(store.display);
const popupView = ref<'Extended' | 'Normal' | 'Minimal'>('Normal');

watch(() => store.view, (newView) => {
    popupView.value = newView;
});

watch(() => store.action, (newAction) => {
    actionSelected.value = newAction;
});

watch(() => store.reaction, (newReaction) => {
    reactionSelected.value = newReaction;
});

watch(() => store.display, (display) => {
    displayPopup.value = display;
});

function removeAction() {
    store.action = null;
}

function removeReaction() {
    store.reaction = null;
}

function changeTitle(title: string) {
    store.title = title;
}

function changeView(view: 'Extended' | 'Normal' | 'Minimal') {
    store.view = view;
}

function handleCreate() {
    console.log('Creating AREA:', store.title, 'with action:', actionSelected.value, 'and reaction:', reactionSelected.value);
    store.display = false;
    window.scrollTo(0, 0);
    router.push('/workshop');
    window.scrollTo(0, 0);
}
</script>

<template>
    <RouterView class="w-screen h-screen"/>
    <CreateAREAPopupComponent
        :action="actionSelected"
        :reaction="reactionSelected"
        :title="store.title"
        :view="popupView"
        @remove-action="removeAction"
        @remove-reaction="removeReaction"
        @create="handleCreate"
        @change-title="changeTitle"
        @change-view="changeView"
        v-if="(actionSelected || reactionSelected || store.title) && displayPopup" />
</template>

<style scoped>
</style>
