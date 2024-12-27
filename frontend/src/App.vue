<script setup lang="ts">
import CreateAREAPopupComponent from './components/CreateAREAPopupComponent.vue';
import { usePopupStore } from './stores/popup';
import { ref, watch } from 'vue';
import { Action, Reaction, Category, Service } from './types/services';

const store = usePopupStore();

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

watch(() => store.action, (newAction) => {
    actionSelected.value = newAction;
});

watch(() => store.reaction, (newReaction) => {
    reactionSelected.value = newReaction;
});

function removeAction() {
    store.action = null;
}

function removeReaction() {
    store.reaction = null;
}
</script>

<template>
    <RouterView class="w-screen h-screen"/>
    <CreateAREAPopupComponent
        :action="actionSelected"
        :reaction="reactionSelected"
        @remove-action="removeAction"
        @remove-reaction="removeReaction"
        v-if="actionSelected || reactionSelected" />
</template>

<style scoped>
</style>
