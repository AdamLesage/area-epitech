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

            <form @submit.prevent="saveProfile" class="space-y-4">
                <div>
                    <label class="block text-left mb-1 font-semibold">Profile Name</label>
                    <input type="text" v-model="editForm.name"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Bio</label>
                    <textarea v-model="editForm.bio" rows="3"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"></textarea>
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Birth Date</label>
                    <input type="date" v-model="editForm.birthDate"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Phone Number</label>
                    <input type="text" v-model="editForm.phoneNumber"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold">Profile Picture</label>
                    <input type="file" @change="handleFileChange"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
                </div>
                <div v-if="editForm.profilePicture">
                    <label class="block text-left mb-1 font-semibold">Preview Avatar</label>
                    <img :src="URL.createObjectURL(editForm.profilePicture)" alt="Profile Picture Preview"
                        class="w-24 h-24 md:w-48 md:h-48 rounded-full mb-6 border-4 border-[#333] mx-auto shadow-lg" />
                </div>

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

const userStore = useUserStore();
const servicesStore = useServiceStore();
const router = useRouter();

// User Info
const user = ref(userStore.user);

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
});

const isEditing = ref(false);
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
    }
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
