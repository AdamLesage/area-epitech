<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-sans text-white">
    <header
      class="fixed top-0 left-0 w-full flex flex-wrap items-center justify-between bg-indigo-900 py-4 px-4 md:px-8 shadow-lg z-50">
      <h1 class="text-2xl md:text-3xl font-bold tracking-wide cursor-pointer" @click="navigateTo('/dashboard')">AREA</h1>
      <nav class="flex gap-2 md:gap-6 mt-4 md:mt-0">
        <button v-for="link in headerLinks" :key="link.name" @click="navigateTo(link.route)"
          class="flex items-center gap-1 md:gap-2 text-xs md:text-lg font-medium bg-indigo-700 px-2 md:px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105">
          <Icon :icon="link.icon" class="text-lg md:text-2xl" />
          {{ link.name }}
        </button>
      </nav>
    </header>
    <div
      class="bg-gray-900 rounded-3xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform hover:scale-105 mt-20">
      <!-- PFP -->
      <img :src="`/images/${user.avatar.split('/').pop()}`" alt="Profile Picture"
        class="w-24 h-24 md:w-48 md:h-48 rounded-full mb-6 border-4 border-gray-700 mx-auto shadow-lg" />

      <!-- Username and creation date -->
      <h2 class="text-xl md:text-4xl font-semibold tracking-wide mb-2">{{ user.name }}</h2>
      <p class="text-xs md:text-sm text-gray-400 font-light">{{ user.created_at }}</p>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row justify-around mt-8 text-center text-gray-300">
        <div class="hover:text-white transition-all duration-300 mb-4 md:mb-0">
          <h3 class="text-2xl md:text-5xl font-extrabold">{{ user.action_created }}</h3>
          <p class="text-xs md:text-base font-light">Actions Created</p>
        </div>
        <div class="hover:text-white transition-all duration-300 mb-4 md:mb-0">
          <h3 class="text-2xl md:text-5xl font-extrabold">{{ user.action_on }}</h3>
          <p class="text-xs md:text-base font-light">Actions On</p>
        </div>
        <div class="hover:text-white transition-all duration-300">
          <h3 class="text-2xl md:text-5xl font-extrabold">{{ user.action_off }}</h3>
          <p class="text-xs md:text-base font-light">Actions Off</p>
        </div>
      </div>

      <!-- Connected Platforms -->
      <div class="mt-8 md:mt-12">
        <h3 class="text-lg md:text-2xl font-semibold mb-4 md:mb-6 tracking-wide">Connected Platforms</h3>
        <ConnectedApiIcons :platforms="detailedPlatforms" @socialClick="handleSocialClick" />
      </div>

      <!-- Add Connections Button -->
      <button @click="goToAddConnections"
        class="mt-6 md:mt-8 px-4 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all">
        Add Connections
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ConnectedApiIcons from "../components/ConnectedApiIcons.vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const router = useRouter();

// User Info
const user = ref({
  name: "Romain Chavalier",
  avatar: "/temppfp.jpeg",
  created_at: "24 June 2021",
  action_created: 65,
  action_on: 43,
  action_off: 21,
  connected_api: [
    { name: "Spotify" },
    { name: "Google" },
    { name: "Twitter" },
    { name: "Facebook" },
    { name: "Instagram" },
    { name: "LinkedIn" },
    { name: "YouTube" },
    { name: "Slack" },
  ],
});

// Platforms
const platformsDetails: { [key: string]: { icon: string; color: string } } = {
  Spotify: { icon: "mdi:spotify", color: "#1DB954" },
  Google: { icon: "mdi:google", color: "#FF0000" },
  Twitter: { icon: "mdi:twitter", color: "#1DA1F2" },
  Facebook: { icon: "mdi:facebook", color: "#1877F2" },
  Instagram: { icon: "mdi:instagram", color: "#E4405F" },
  LinkedIn: { icon: "mdi:linkedin", color: "#0077B5" },
  YouTube: { icon: "mdi:youtube", color: "#FF0000" },
  Slack: { icon: "mdi:slack", color: "#611F69" },
};

// Computed Properties for ConnectedApiIcons
const detailedPlatforms = computed(() =>
  user.value.connected_api.map((api) => ({
    name: api.name,
    ...platformsDetails[api.name as keyof typeof platformsDetails],
  }))
);

// Functions for ConnectedApiIcons
function handleSocialClick(platformName: string) {
  console.log(`Connect with ${platformName}`);
}

// Navigation to Add Connections
function goToAddConnections() {
  router.push("/add-connections");
}

// Header Links
const headerLinks = [
  { name: "Explore", icon: "mdi:compass-outline", route: "/explore" },
  { name: "My Areas", icon: "mdi:folder-outline", route: "/areas" },
  { name: "Updates", icon: "mdi:bell-outline", route: "/updates" },
  { name: "Profile", icon: "mdi:account-outline", route: "/userinfo" },
];

// Navigation Function for Header Links
function navigateTo(route: string) {
  router.push(route);
}
</script>

<style scoped>
</style>
