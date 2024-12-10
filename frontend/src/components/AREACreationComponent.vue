<template>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 p-6 bg-[#0A0A33] rounded-lg shadow-lg text-white w-160 max-w-full">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Create AREA</h2>
        <button class="text-2xl hover:text-red-400" @click="$emit('close')">&times;</button>
      </div>

      <!-- Title Input -->
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Title</h3>
        <input v-model="title" type="text" class="p-2 rounded-lg text-black" placeholder="Enter title" />
      </div>
  
      <!-- Action Service  -->
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Select Action Platform</h3>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="service in services"
            :key="service.name"
            @click="selectActionPlatform(service.name)"
            :class="{
              'bg-blue-600 border border-blue-300': selectedActionPlatform === service.name,
              'bg-blue-800': selectedActionPlatform !== service.name,
            }"
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${service.name}`" class="text-2xl" />
            <span class="text-sm font-medium">{{ service.name }}</span>
          </div>
        </div>
      </div>
  
      <!--  Actions for action service selected -->
      <div v-if="actions.length" class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Available Actions</h3>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="action in actions"
            :key="action.name"
            @click="selectedAction = action.name"
            :class="{
              'bg-blue-600 border border-blue-300': selectedAction === action.name,
              'bg-blue-800': selectedAction !== action.name,
            }"
            class="p-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${action.name}`" class="text-2xl" />
            <span class="text-sm">{{ action.name }}</span>
          </div>
        </div>
      </div>
  
      <!-- Reaction Service -->
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Select Reaction Platform</h3>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="service in services"
            :key="service.name"
            @click="selectReactionPlatform(service.name)"
            :class="{
              'bg-blue-600 border border-blue-300': selectedReactionPlatform === service.name,
              'bg-blue-800': selectedReactionPlatform !== service.name,
            }"
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${service.name}`" class="text-2xl" />
            <span class="text-sm font-medium">{{ service.name }}</span>
          </div>
        </div>
      </div>
  
      <!--  Reactions  for reaction service selected-->
      <div v-if="reactions.length" class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Available Reactions</h3>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="reaction in reactions"
            :key="reaction.name"
            @click="selectedReaction = reaction.name"
            :class="{
              'bg-blue-600 border border-blue-300': selectedReaction === reaction.name,
              'bg-blue-800': selectedReaction !== reaction.name,
            }"
            class="p-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${reaction.name}`" class="text-2xl" />
            <span class="text-sm">{{ reaction.name }}</span>
          </div>
        </div>
      </div>
  
      <!-- Create Area Button -->
      <button
        @click="createArea"
        class="w-full py-2 bg-red-500 text-lg font-medium rounded-lg hover:bg-red-600 transition"
      >
        Create Area
      </button>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/users';
import { Icon } from '@iconify/vue';
import { Service } from '@/types/services';

import axios from 'axios';
import Cookies from 'js-cookie';

const store = useUserStore();

const user = store.user;

const serviceStore = useServiceStore();

const services = ref<Service[]>([]);
const selectedActionPlatform = ref('');
const selectedReactionPlatform = ref('');
const actions = ref<{ name: string; description: string; }[]>([]);
const selectedReaction = ref('');
const selectedAction = ref('');
const reactions = ref<{ name: string; description: string; }[]>([]);
const title = ref('');

const emit = defineEmits(['close']);

onMounted(() => {
    services.value = serviceStore.services;
});

const selectActionPlatform = (platform: string) => {
    selectedActionPlatform.value = platform;
    fetchActions();
};

const selectReactionPlatform = (platform: string) => {
    selectedReactionPlatform.value = platform;
    fetchReactions();
};

const fetchActions = () => {
    const service = serviceStore.services.find(s => s.name === selectedActionPlatform.value);
    actions.value = service ? service.actions : [];
};

const fetchReactions = () => {
    const service = serviceStore.services.find(s => s.name === selectedReactionPlatform.value);
    reactions.value = service ? service.reactions : [];
};

const createArea = async () => {
    if (!title.value || !selectedActionPlatform.value || !selectedReactionPlatform.value || !selectedAction.value || !selectedReaction.value) {
        alert('Please fill in all fields.');
        return;
    }

    if (!user) {
        alert('User is not logged in.');
        return;
    }

    console.log('Area created with:', {
        title: title.value,
        actionPlatform: selectedActionPlatform.value,
        reactionPlatform: selectedReactionPlatform.value,
        selectedAction: selectedAction.value,
        selectedReaction: selectedReaction.value,
        uuid: user.uuid,
    });

    const token = Cookies.get('token');

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/action-reaction`, {
        title: title.value,
        userUuid: user.uuid,
        description: 'None',
        actionName: selectedAction.value,
        reactionName: selectedReaction.value,
        reactionData: {},
        actionData: {},
    },{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status !== 201) {
        alert('Error while creating area');
        return;
    }

    emit('close');
    alert('Area created');
};
</script>
