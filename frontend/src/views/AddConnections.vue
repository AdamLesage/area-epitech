<template>
    <div class="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans flex justify-center items-center">
        <div class="bg-gray-900 rounded-3xl p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl relative">
            <button @click="goBack" class="absolute top-4 right-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all text-xl">Back</button>
            <h2 class="text-4xl font-semibold mb-8 tracking-wide">Add a New Connection</h2>
            <div class="grid grid-cols-4 gap-6">
                <button
                    v-for="platform in platforms"
                    :key="platform.name"
                    :style="{ backgroundColor: platform.color }"
                    @click="selectPlatform(platform.name)"
                    class="p-6 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
                >
                    <Icon :icon="platform.icon" class="text-4xl text-white" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from 'vue-router';

const router = useRouter();


// List of platforms to connect to with their respective icons and colors
const platforms = ref([
    { name: "Spotify", icon: "mdi:spotify", color: "#1DB954" },
    { name: "Google", icon: "mdi:google", color: "#FF0000" },
    { name: "Twitter", icon: "mdi:twitter", color: "#1DA1F2" },
    { name: "Facebook", icon: "mdi:facebook", color: "#1877F2" },
    { name: "Instagram", icon: "mdi:instagram", color: "#E4405F" },
    { name: "LinkedIn", icon: "mdi:linkedin", color: "#0077B5" },
    { name: "YouTube", icon: "mdi:youtube", color: "#FF0000" },
    { name: "Slack", icon: "mdi:slack", color: "#611F69" },
    { name: "Twitch", icon: "mdi:twitch", color: "#6441A4" },
    { name: "Discord", icon: "mdi:discord", color: "#5865F2" },
    { name: "Reddit", icon: "mdi:reddit", color: "#FF4500" },
    { name: "Pinterest", icon: "mdi:pinterest", color: "#E60023" },
    { name: "Snapchat", icon: "ri:snapchat-fill", color: "#FFFC00" },
    { name: "WhatsApp", icon: "mdi:whatsapp", color: "#25D366" },
    { name: "Telegram", icon: "mdi:telegram", color: "#0088CC" },
    { name: "Signal", icon: "mdi:signal", color: "#0081FF" },
    { name: "Skype", icon: "mdi:skype", color: "#00AFF0" },
    { name: "Microsoft", icon: "mdi:microsoft", color: "#F25022" },
    { name: "Apple", icon: "mdi:apple", color: "#000000" },
    { name: "Amazon", icon: "mdi:amazon", color: "#FF9900" },
    { name: "Netflix", icon: "mdi:netflix", color: "#E50914" },
    { name: "Hulu", icon: "mdi:hulu", color: "#1CE783" },
    { name: "GitHub", icon: "mdi:github", color: "#181717" }
]);


// Function to select a platform
function selectPlatform(platformName: string) {
    console.log(`Selected platform: ${platformName}`);
}


// Function to navigate back to the user info page
function goBack() {
    router.push('/userinfo');
}
</script>