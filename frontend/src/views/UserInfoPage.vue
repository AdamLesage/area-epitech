<template>
  <div
    class="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-sans text-white">
    <div
      class="bg-gray-900 rounded-3xl p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform hover:scale-105">
      <!-- PFP -->
      <img :src="`/images/${user.avatar.split('/').pop()}`" alt="Profile Picture"
        class="w-48 h-48 rounded-full mb-6 border-4 border-gray-700 mx-auto shadow-lg" />


      <!-- Usernam and creation date -->
      <h2 class="text-4xl font-semibold tracking-wide mb-2">{{ user.name }}</h2>
      <p class="text-sm text-gray-400 font-light">{{ user.created_at }}</p>

      <!-- Actions -->
      <div class="flex justify-around mt-8 text-center text-gray-300">
        <div class="hover:text-white transition-all duration-300">
          <h3 class="text-5xl font-extrabold">{{ user.action_created }}</h3>
          <p class="text-base font-light">Actions Created</p>
        </div>
        <div class="hover:text-white transition-all duration-300">
          <h3 class="text-5xl font-extrabold">{{ user.action_on }}</h3>
          <p class="text-base font-light">Actions On</p>
        </div>
        <div class="hover:text-white transition-all duration-300">
          <h3 class="text-5xl font-extrabold">{{ user.action_off }}</h3>
          <p class="text-base font-light">Actions Off</p>
        </div>
      </div>

      <!-- Connected Plats -->
      <div class="mt-12">
        <h3 class="text-2xl font-semibold mb-6 tracking-wide">Connected Platforms</h3>
        <ConnectedApiIcons :platforms="detailedPlatforms" @socialClick="handleSocialClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ConnectedApiIcons from "../components/ConnectedApiIcons.vue";

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
const detailedPlatforms = computed(() =>
  user.value.connected_api.map((api) => ({
    name: api.name,
    ...platformsDetails[api.name as keyof typeof platformsDetails],
  }))
);
function handleSocialClick(platformName: string) {
  console.log(`Connect with ${platformName}`);
}
</script>
