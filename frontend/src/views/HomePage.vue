<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
        <!-- navbar -->
        <header class="flex flex-wrap items-center justify-between bg-indigo-900 py-4 px-8 shadow-lg">
            <h1 class="text-3xl font-bold tracking-wide">AREA</h1>
            <nav class="flex gap-6 mt-4 md:mt-0">
                <button v-for="link in headerLinks" :key="link.name" @click="navigateTo(link.route)"
                    class="flex items-center gap-2 text-lg font-medium bg-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105">
                    <Icon :icon="link.icon" class="text-2xl" />
                    {{ link.name }}
                </button>
            </nav>
        </header>

        <div class="flex flex-col md:flex-row h-full">
            <!-- Updates -->
            <aside class="w-full md:w-1/5 bg-indigo-800 text-center p-6">
                <h2 class="text-xl font-bold mb-6">Updates</h2>
                <div class="flex flex-col gap-4">
                    <div v-for="update in updates" :key="update.id"
                        class="bg-indigo-700 p-4 rounded-lg shadow-md text-left transition-transform transform hover:scale-105 hover:bg-indigo-600">
                        {{ update.content }}
                    </div>
                </div>
            </aside>

            <main class="flex-1 bg-gray-900 p-5 grid grid-rows-4 gap-4">
                <!-- Search Bar -->
                <section class="bg-gray-800 rounded-xl shadow-lg p-2 flex flex-col gap-4">
                    <h2 class="text-2xl font-bold tracking-wide">Search</h2>
                    <input type="text" placeholder="Search for Areas, Actions, or Suggestions..."
                        class="w-full p-2 text-black rounded-lg shadow-md focus:ring-4 focus:ring-indigo-600" />
                </section>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Premade Area -->
                    <section class="bg-indigo-700 rounded-xl shadow-lg p-6">
                        <h2 class="text-2xl font-bold tracking-wide mb-6">Suggestions</h2>
                        <ul class="space-y-4">
                            <li
                                class="bg-indigo-600 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-transform transform hover:scale-105">
                                <span class="font-medium">📩 Receive merge info by mail (GitHub)</span>
                                <button class="bg-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-900">Try</button>
                            </li>
                            <li
                                class="bg-indigo-600 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-transform transform hover:scale-105">
                                <span class="font-medium">❤️ Automatically like tweets (Twitter)</span>
                                <button class="bg-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-900">Try</button>
                            </li>
                            <li
                                class="bg-indigo-600 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-transform transform hover:scale-105">
                                <span class="font-medium">📜 Get daily updates on a subject (RSS Feed)</span>
                                <button class="bg-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-900">Try</button>
                            </li>
                        </ul>
                    </section>

                    <!-- Explore -->
                    <section class="bg-indigo-600 rounded-xl shadow-lg p-6">
                        <h2 class="text-2xl font-bold tracking-wide mb-6">Explore</h2>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div v-for="platform in connectedPlatforms" :key="platform.name"
                                :class="['flex flex-col items-center p-4 rounded-lg hover:bg-opacity-75 transition-transform transform hover:scale-105', platform.color]">
                                <Icon :icon="platform.icon" class="text-4xl mb-2" />
                                <span class="text-lg font-medium">{{ platform.name }}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();


// Header Links for navigation
const headerLinks = [
    { name: "Explore", icon: "mdi:compass-outline", route: "/explore" },
    { name: "My Areas", icon: "mdi:folder-outline", route: "/areas" },
    { name: "Updates", icon: "mdi:bell-outline", route: "/updates" },
    { name: "Profile", icon: "mdi:account-outline", route: "/userinfo" },
];


// Function to navigate to a route
function navigateTo(route: string) {
    router.push(route);
}


// List of connected platforms with their respective icons and colors
const connectedPlatforms = ref([
    { name: "Spotify", icon: "mdi:spotify", color: "bg-green-500" },
    { name: "Google", icon: "mdi:google", color: "bg-red-500" },
    { name: "Twitter", icon: "mdi:twitter", color: "bg-blue-500" },
    { name: "Facebook", icon: "mdi:facebook", color: "bg-blue-700" },
    { name: "Instagram", icon: "mdi:instagram", color: "bg-pink-500" },
    { name: "LinkedIn", icon: "mdi:linkedin", color: "bg-blue-800" },
    { name: "YouTube", icon: "mdi:youtube", color: "bg-red-600" },
    { name: "Slack", icon: "mdi:slack", color: "bg-purple-500" },
]);


// Updates list
const updates = ref([
    { id: 1, content: "✅ Created Login Page" },
    { id: 2, content: "✅ Created Register Page" },
    { id: 3, content: "✅ Added User Info Page" },
    { id: 4, content: "🚧 Started Home Page" },
    { id: 5, content: "🚧 Backend API Integration" },
]);
</script>

<style scoped>
</style>
