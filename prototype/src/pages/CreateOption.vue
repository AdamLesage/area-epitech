<template>
  <div class="create-option text-center font-sans text-white bg-gradient-to-r from-blue-900 to-blue-800 min-h-screen p-5">
    <h1 class="text-4xl text-orange-400 mb-5">Create Option</h1>
    <div class="button-group flex flex-wrap justify-center gap-4">
      <button
        v-for="platform in platforms"
        :key="platform.name"
        :style="{ backgroundColor: platform.color }"
        @click="selectPlatform(platform.name)"
        class="platform-btn border-none rounded-full transition-transform duration-300 ease-in-out p-3"
      >
        <span class="text-white text-xl">
          <icon :icon="platform.icon" class="text-3xl"></icon>
        </span>
      </button>
    </div>

    <div v-if="selectedPlatform" class="dynamic-form bg-blue-900 text-white p-8 rounded-2xl shadow-lg inline-block text-left mt-5">
      <h2 class="text-2xl mb-4 text-orange-400">Create an action for {{ selectedPlatform }}</h2>
      <form @submit.prevent="submitForm">
        <div v-if="selectedPlatform === 'Reddit'" class="form-group mb-5">
          <label for="subreddit" class="font-bold text-orange-200 block mb-2">Subreddit Name</label>
          <input
            type="text"
            id="subreddit"
            v-model="formData.subreddit"
            placeholder="Enter subreddit name"
            required
            class="w-full p-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <div v-if="selectedPlatform === 'Twitter'" class="form-group mb-5">
          <label for="tweet" class="font-bold text-orange-200 block mb-2">Tweet Content</label>
          <input
            type="text"
            id="tweet"
            v-model="formData.tweet"
            placeholder="Enter your tweet content"
            required
            class="w-full p-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <div class="form-group mb-5">
          <label class="font-bold text-orange-200 block mb-2">Action Type</label>
          <div class="action-type-selector flex flex-wrap justify-center gap-2">
            <button
              v-for="action in getActionsForPlatform(selectedPlatform)"
              :key="action"
              @click="selectActionType(action)"
              :class="{ 'selected': formData.actionType === action }"
              class="action-btn bg-blue-700 rounded-lg text-white transition-transform duration-300 ease-in-out p-2"
            >
              {{ action }}
            </button>
          </div>
        </div>
      </form>

      <h2 class="text-2xl mb-4 text-orange-400">Create a reaction</h2>
      <form @submit.prevent="submitReactionForm">
        <div class="form-group mb-5">
          <label class="font-bold text-orange-200 block mb-2">Reaction Platform</label>
          <div class="reaction-platform-selector flex flex-wrap justify-center gap-2">
            <button
              v-for="platform in platforms"
              :key="platform.name"
              @click="selectReactionPlatform(platform.name)"
              :class="{ 'selected': formData.reactionPlatform === platform.name }"
              class="reaction-btn bg-blue-700 rounded-lg text-white transition-transform duration-300 ease-in-out p-2"
            >
              <icon :icon="platform.icon" class="text-2xl"></icon>
            </button>
          </div>
        </div>
        <div class="form-group mb-5">
          <label class="font-bold text-orange-200 block mb-2">Reaction Type</label>
          <div class="reaction-type-selector flex flex-wrap justify-center gap-2">
            <button
              v-for="reaction in getReactionsForPlatform(formData.reactionPlatform)"
              :key="reaction"
              @click="selectReactionType(reaction)"
              :class="{ 'selected': formData.reactionType === reaction }"
              class="reaction-btn bg-blue-700 rounded-lg text-white transition-transform duration-300 ease-in-out p-2"
            >
              {{ reaction }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="submit-btn block mx-auto p-2 bg-orange-400 text-white text-lg rounded-full transition-transform duration-300 ease-in-out hover:bg-orange-500 hover:translate-y-1"
        >
          Create ActionReaction
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
const platforms = ref([
  { name: 'Facebook', icon: 'mdi:facebook', color: 'rgb(59, 89, 152)' },
  { name: 'Twitter', icon: 'mdi:twitter', color: 'rgb(85, 172, 238)' },
  { name: 'Reddit', icon: 'mdi:reddit', color: 'rgb(255, 69, 0)' },
  { name: 'Instagram', icon: 'mdi:instagram', color: 'rgb(172, 43, 172)' },
  { name: 'LinkedIn', icon: 'mdi:linkedin', color: 'rgb(0, 130, 202)' },
  { name: 'YouTube', icon: 'mdi:youtube', color: 'rgb(237, 48, 47)' },
  { name: 'WhatsApp', icon: 'mdi:whatsapp', color: 'rgb(37, 211, 102)' },
  { name: 'Google', icon: 'mdi:google', color: 'rgb(221, 75, 57)' },
  { name: 'Pinterest', icon: 'mdi:pinterest', color: 'rgb(198, 17, 24)' },
  { name: 'VK', icon: 'mdi:vk', color: 'rgb(76, 117, 163)' },
  { name: 'Stack Overflow', icon: 'mdi:stack-overflow', color: 'rgb(255, 172, 68)' },
  { name: 'Slack', icon: 'mdi:slack', color: 'rgb(72, 20, 73)' },
  { name: 'GitHub', icon: 'mdi:github', color: 'rgb(51, 51, 51)' },
  { name: 'Dribbble', icon: 'mdi:dribbble', color: 'rgb(236, 74, 137)' },
]);

const selectedPlatform = ref<string | null>(null);
const formData = ref({
  subreddit: '',
  tweet: '',
  actionType: '',
  reactionPlatform: '',
  reactionType: '',
  value: '',
});

function selectPlatform(platformName: string) {
  selectedPlatform.value = platformName;
  formData.value = { subreddit: '', tweet: '', actionType: '', reactionPlatform: '', reactionType: '', value: '' };
}

function selectActionType(action: string) {
  formData.value.actionType = action;
}

function selectReactionPlatform(platformName: string) {
  formData.value.reactionPlatform = platformName;
  formData.value.reactionType = '';
}

function selectReactionType(reaction: string) {
  formData.value.reactionType = reaction;
}

function submitForm() {
  console.log(`Creating action for ${selectedPlatform.value}:`, formData.value);
  alert(`Action created for ${selectedPlatform.value}!`);
  selectedPlatform.value = null;
}

function submitReactionForm() {
  console.log(`Creating reaction for ${formData.value.reactionPlatform}:`, formData.value);
  alert(`ActionReaction created for ${formData.value.reactionPlatform}!`);
  selectedPlatform.value = null;
}

function getActionsForPlatform(platform: string) {
  switch (platform) {
    case 'Facebook':
      return ['Like', 'Comment', 'Share'];
    case 'Twitter':
      return ['Tweet', 'Retweet', 'Like'];
    case 'Reddit':
      return ['Post', 'Comment', 'Upvote'];
    case 'Instagram':
      return ['Post', 'Comment', 'Like'];
    case 'LinkedIn':
      return ['Post', 'Comment', 'Like'];
    case 'YouTube':
      return ['Subscribe', 'Comment', 'Like'];
    case 'WhatsApp':
      return ['Message', 'Call', 'Video Call'];
    case 'Google':
      return ['Search', 'Review', 'Comment'];
    case 'Pinterest':
      return ['Pin', 'Comment', 'Like'];
    case 'VK':
      return ['Post', 'Comment', 'Like'];
    case 'Stack Overflow':
      return ['Ask Question', 'Answer Question', 'Comment'];
    case 'Slack':
      return ['Message', 'Call', 'Video Call'];
    case 'GitHub':
      return ['Create Repository', 'Issue', 'Pull Request'];
    case 'Dribbble':
      return ['Post', 'Comment', 'Like'];
    default:
      return [];
  }
}

function getReactionsForPlatform(platform: string) {
  switch (platform) {
    case 'Facebook':
      return ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];
    case 'Twitter':
      return ['Like', 'Retweet', 'Reply'];
    case 'Reddit':
      return ['Upvote', 'Downvote', 'Comment'];
    case 'Instagram':
      return ['Like', 'Comment'];
    case 'LinkedIn':
      return ['Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious'];
    case 'YouTube':
      return ['Like', 'Dislike', 'Comment'];
    case 'WhatsApp':
      return ['Like', 'Love', 'Laugh', 'Surprised', 'Sad', 'Angry'];
    case 'Google':
      return ['Like', 'Dislike', 'Comment'];
    case 'Pinterest':
      return ['Like', 'Comment'];
    case 'VK':
      return ['Like', 'Comment'];
    case 'Stack Overflow':
      return ['Upvote', 'Downvote', 'Comment'];
    case 'Slack':
      return ['Like', 'Laugh', 'Surprised', 'Sad', 'Angry'];
    case 'GitHub':
      return ['Star', 'Fork', 'Watch'];
    case 'Dribbble':
      return ['Like', 'Comment'];
    default:
      return [];
  }
}
</script>

<style scoped>
.platform-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.action-btn.selected,
.reaction-btn.selected {
  background-color: #ff851b;
  color: white;
  font-weight: bold;
  transform: scale(1.1);
}
</style>
