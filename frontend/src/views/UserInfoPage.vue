<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-home font-sans text-white">
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10 absolute top-0" />

        <div v-if="!isEditing && user"
            class="bg-home-div rounded-xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform mt-20">

            <!-- Edit Profile Button -->
            <button @click="toggleEdit"
                class="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 hover:border-white border-2 border-transparent text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all flex items-center justify-center gap-2">
                <Icon icon="bi:pencil-fill" class="w-4 h-4" />
                <span>Edit Profile</span>
            </button>

            <!-- PFP -->
            <img :src="(user.profilePicture == null) ? '/images/temppfp.jpeg' : user.profilePicture.url"
                alt="Profile Picture"
                class="w-24 h-24 md:w-48 md:h-48 rounded-full mb-6 border-4 border-[#333] mx-auto shadow-lg" />

            <!-- Username and creation date -->
            <h2 class="text-xl md:text-4xl font-semibold tracking-wide mb-2">{{ user.name }}</h2>
            <p class="text-xs md:text-sm text-gray-400 font-light">{{ user.bio }}</p>

            <!-- Actions -->
            <div class="flex flex-col md:flex-row justify-around mt-8 text-center text-gray-300">
                <div class="hover:text-white transition-all duration-300 mb-4 md:mb-0 w-1/3">
                    <h3 class="text-2xl md:text-5xl font-extrabold">{{ userStore.areas.length }}</h3>
                    <p class="text-xs md:text-base font-light">Actions Created</p>
                </div>
                <div class="hover:text-white transition-all duration-300 mb-4 md:mb-0 w-1/3">
                    <h3 class="text-2xl md:text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive ==
                        true).length }}</h3>
                    <p class="text-xs md:text-base font-light">Actions <span class="text-green-500">On</span></p>
                </div>
                <div class="hover:text-white transition-all duration-300 w-1/3">
                    <h3 class="text-2xl md:text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive ==
                        false).length }}</h3>
                    <p class="text-xs md:text-base font-light">Actions <span class="text-red-500">Off</span></p>
                </div>
            </div>

            <!-- Connected Platforms -->
            <div class="mt-8 md:mt-12">
                <h3 class="text-lg md:text-2xl font-semibold mb-4 md:mb-6 tracking-wide">Connected Platforms</h3>
                <ConnectedApiIcons :platforms="detailedPlatforms ?? []" @socialClick="handleSocialClick" />
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 justify-center items-center w-full">
                <button @click="goToAddConnections"
                    class="mt-6 md:mt-8 px-4 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all">
                    Add Connections
                </button>
                <button @click="logout"
                    class="mt-6 md:mt-8 px-4 md:px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all">
                    Logout
                </button>
            </div>
        </div>

        <!-- Edit Profile Card -->
        <div v-else
            class="bg-home-div rounded-xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform mt-20">
            <h2 class="text-2xl md:text-4xl font-semibold tracking-wide mb-6">Edit Profile</h2>

            <form @submit.prevent="saveProfile" class="space-y-6">
                <div class="flex flex-col items-center space-y-4">
                    <!-- Avatar Section -->
                    <div class="relative">
                        <img :src="profilePictureURL"
                            alt="Profile Picture"
                            class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 shadow-lg" />

                        <!-- Upload Button -->
                        <label for="profile-picture-input"
                            class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="white" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </label>
                        <input id="profile-picture-input" type="file" @change="handleFileChange" class="hidden" />
                    </div>
                </div>

                <!-- Other Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-left mb-1 font-semibold">Profile Name</label>
                        <input type="text" v-model="editForm.name"
                            class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist" />
                    </div>
                    <div>
                        <label class="block text-left mb-1 font-semibold">Birth Date</label>
                        <input ref="birthDateInput" type="date" v-model="editForm.birthDate"
                            class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist" />
                    </div>
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Phone Number</label>
                    <input type="text" v-model="editForm.phoneNumber" placeholder="🇫🇷  +33"
                        class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist"
                        @input="editForm.phoneNumber = editForm.phoneNumber.replace(/[^0-9]/g, '')" />
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Bio</label>
                    <textarea v-model="editForm.bio" rows="3"
                        class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist"></textarea>
                </div>

                <!-- Buttons -->
                <div class="flex gap-4 justify-center items-center w-full">
                    <button type="submit"
                        class="mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all">
                        Save Changes
                    </button>
                    <button @click="toggleEdit"
                        class="mt-6 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ConnectedApiIcons from "../components/ConnectedApiIcons.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useServiceStore } from "@/stores/service";
import Cookies from 'js-cookie';
import ServiceNavComponent from "@/components/ServiceNavComponent.vue";
import { Icon } from '@iconify/vue';
import CustomInput from "@/components/CustomInput.vue";

const userStore = useUserStore();
const servicesStore = useServiceStore();
const router = useRouter();

// User Info
const user = ref(userStore.user);
const profilePictureURL = ref('/images/temppfp.jpeg');

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
});

const isEditing = ref(false);
console.log(user.value);
const editForm = ref({
    name: user.value?.name || "",
    bio: user.value?.bio || "",
    birthDate: user.value?.birthDate || "",
    phoneNumber: user.value?.phoneNumber || "",
    profilePicture: null as File | null
});

function toggleEdit() {
    isEditing.value = !isEditing.value;
}

function saveProfile() {
    // Update user data logic here
    // userStore.setUser({
    //     ...user.value,
    //     ...editForm.value,
    // });
    toggleEdit();
}

function handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        editForm.value.profilePicture = file;
        profilePictureURL.value = URL.createObjectURL(file);
    }
}

function displaySpacedPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "+$1 $2 $3 $4 $5");
}

function handleBackButton() {
    router.push('/dashboard');
}

function logout() {
    userStore.setUser(null);
    Cookies.remove('token');
    router.push('/');
}

interface Platform {
    name: string;
    color: string;
    icon: string;
}

// Computed Properties for ConnectedApiIcons
const detailedPlatforms = computed<Platform[]>(() => {
    if (!user.value?.linkedAccounts) return [];

    return user.value.linkedAccounts
        .map((linkedService) => {
            const service = servicesStore.services.find((s) => s.name === linkedService.serviceName);
            if (!service) return null;

            return {
                name: service.name,
                color: service.color,
                icon: service.icon,
            };
        }).filter((service): service is Platform => service !== null);
});

function handleSocialClick(platformName: string) {
    console.log(`Connect with ${platformName}`);
}

function goToAddConnections() {
    router.push("/add-connections");
}
</script>
