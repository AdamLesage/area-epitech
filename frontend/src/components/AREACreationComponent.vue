<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
  >
    <div
      class="bg-[#0A0A33] text-white rounded-lg shadow-lg p-4 w-full max-w-md md:max-w-2xl lg:max-w-4xl max-h-screen overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Create AREA</h2>
        <button class="text-2xl hover:text-red-400" @click="$emit('close')">
          &times;
        </button>
      </div>

      <!-- Title Input -->
      <div class="mb-4">
        <label class="block text-lg mb-2">Title</label>
        <input
          v-model="title"
          type="text"
          class="w-full p-2 rounded-lg text-black"
          placeholder="Enter title"
        />
      </div>

      <!-- Action Platform -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Select Action Platform</h3>
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-x-auto"
        >
          <div
            v-for="service in services"
            :key="service.name"
            @click="selectActionPlatform(service.name)"
            :class="{
              'bg-blue-600 border border-blue-300': selectedActionPlatform === service.name,
              'bg-blue-800': selectedActionPlatform !== service.name,
            }"
            class="flex flex-col items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${service.name}`" class="text-xl" />
            <span class="text-xs">{{ service.name }}</span>
          </div>
        </div>
      </div>

    <!-- Available Actions -->
    <div v-if="actions.length" class="mb-4">
      <h3 class="text-lg font-semibold mb-2">Available Actions</h3>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="action in actions"
          :key="action.name"
          @click="selectedAction = action.name"
          :class="{
            'bg-blue-600 border border-blue-300': selectedAction === action.name,
            'bg-blue-800': selectedAction !== action.name,
          }"
          class="p-3 rounded-lg hover:bg-blue-700 cursor-pointer transition text-center"
        >
          <span class="text-sm">{{ action.name }}</span>
        </div>
      </div>
    </div>

      <!-- Reaction Platform -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Select Reaction Platform</h3>
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-x-auto"
        >
          <div
            v-for="service in services"
            :key="service.name"
            @click="selectReactionPlatform(service.name)"
            :class="{
              'bg-blue-600 border border-blue-300': selectedReactionPlatform === service.name,
              'bg-blue-800': selectedReactionPlatform !== service.name,
            }"
            class="flex flex-col items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            <Icon :icon="`mdi:${service.name}`" class="text-xl" />
            <span class="text-xs">{{ service.name }}</span>
          </div>
        </div>
      </div>
      <!-- Available Reactions -->
      <div v-if="reactions.length" class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Available Reactions</h3>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="reaction in reactions"
            :key="reaction.name"
            @click="selectedReaction = reaction.name"
            :class="{
              'bg-blue-600 border border-blue-300': selectedReaction === reaction.name,
              'bg-blue-800': selectedReaction !== reaction.name,
            }"
            class="p-3 rounded-lg hover:bg-blue-700 cursor-pointer transition text-center"
          >
            <span class="text-sm">{{ reaction.name }}</span>
          </div>
        </div>
      </div>


      <!-- Create Area Button -->
      <button
        @click="createArea"
        class="w-full py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
      >
        Create Area
      </button>
    </div>
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
    actions.value = [];
    for (const category of service?.categories || []) {
        actions.value.push(...category.actions);
    }
    console.log('Actions:', actions.value);
};

const fetchReactions = () => {
    const service = serviceStore.services.find(s => s.name === selectedReactionPlatform.value);
    reactions.value = [];
    for (const category of service?.categories || []) {
        reactions.value.push(...category.reactions);
    }
    console.log('Reactions:', reactions.value);
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

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/action`, {
        title: title.value,
        typeAction: selectedAction.value,
        typeReaction: selectedReaction.value,
        reactionData: {
          "repoOwner": "area-ownspace",
          "repoName": "demo-repository",
        },
        actionData: {},
    },{
        headers: {
            Authorization: token,
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
