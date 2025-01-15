<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-home font-sans text-white">
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10 absolute top-0" />

        <div v-if="!isEditing && user"
            class="bg-home-div rounded-xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform mt-20">

            <!-- Edit Profile Button -->
            <button @click="toggleEdit"
                class="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 hover:border-white border-2 border-transparent text-white font-bold px-4 py-2 md:px-6 md:py-2 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                aria-label="Edit Profile">
                <Icon icon="bi:pencil-fill" class="w-4 h-4 md:w-5 md:h-5" />
                <span class="hidden md:inline">Edit Profile</span>
            </button>

            <!-- PFP -->
            <img :src="user.profilePictureUrl"
                alt="Profile Picture"
                class="w-24 h-24 md:w-48 md:h-48 rounded-full mb-6 border-4 border-white mx-auto shadow-lg" />

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
                    class="mt-6 md:mt-8 px-4 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all"
                    aria-label="Add Connections">
                    Add Connections
                </button>
                <button @click="logout"
                    class="mt-6 md:mt-8 px-4 md:px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all"
                    aria-label="Logout">
                    Logout
                </button>
            </div>
        </div>

        <!-- Edit Profile Card -->
        <div v-else
            class="bg-home-div rounded-xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform mt-20">
            <h2 class="text-2xl md:text-4xl font-semibold tracking-wide mb-6">Edit Profile</h2>

            <form @submit.prevent="saveProfile" class="space-y-6" :validation-schema="schema">
                <div class="flex flex-col items-center space-y-4">
                    <!-- Avatar Section -->
                    <div class="flex flex-col items-center space-y-4">
                        <!-- Avatar Section -->
                        <div class="relative">
                            <img :src="user?.profilePictureUrl" alt="Profile Picture"
                                class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 shadow-lg" />

                            <!-- Upload Button -->
                            <button type="button" :onclick="openPopup"
                                class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="white" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <!-- Popup for Image Selection -->
                        <div v-if="showPopup"
                            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                            <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4">Choose an Image</h3>
                                <div class="grid grid-cols-3 gap-4 justify-center">
                                    <img v-for="(image, index) in images" :key="index" :src="image"
                                        :alt="'Option ' + (index + 1)"
                                        class="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-md w-32 h-32 object-cover"
                                        @click="selectImage(image)" />
                                </div>
                                <button @click="closePopup"
                                    class="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">Cancel</button>
                            </div>
                        </div>
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
                    <input type="tel" v-model="editForm.phoneNumber" placeholder="🇫🇷  +33"
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
                        class="mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all"
                        aria-label="Save Changes">
                        Save Changes
                    </button>
                    <button @click="toggleEdit"
                        class="mt-6 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all"
                        aria-label="Cancel">
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
import * as yup from 'yup';

const userStore = useUserStore();
const servicesStore = useServiceStore();
const router = useRouter();

// User Info
const user = ref(userStore.user);

const showPopup = ref(false);
const images = [
    'https://render.fineartamerica.com/images/rendered/default/poster/7.5/8/break/images/artworkimages/medium/3/painting-chimp-profile-animal-monkey-portrait-fac-n-akkash.jpg',
    'data:image/jpeg;base64,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',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQazX23mmRHm5lgOZFbIud3sAtL42CI-ykqw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcuxHZa3v-lXfJ7pht9asToYn0T2iaDZYC-Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj99Q4V5JK8HyiS1pB8vdl9YAVkMMNd0izw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX4NAMWyVaJNETPVYdp3cxMy2GZVbEcPqL1Q&s'
];

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
    editForm.value = {
        name: newUser?.name || "",
        bio: newUser?.bio || "",
        birthDate: newUser?.birthDate || "",
        phoneNumber: newUser?.phoneNumber || "",
        profilePicture: null
    };
});

const schema = yup.object({
    phoneNumber: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
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

function selectImage(image: string) {
    editForm.value.profilePicture = null;
    if (user.value) {
        user.value.profilePicture = { id: user.value.profilePicture?.id || 0, url: image };
    }
    showPopup.value = false;
}

function closePopup() {
    showPopup.value = false;
}

function openPopup() {
    showPopup.value = true;
}

function toggleEdit() {
    isEditing.value = !isEditing.value;
}

function saveProfile() {
    // Fetch API to update user details
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/${user.value?.uuid}`;
    fetch(URL, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${user.value?.authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: editForm.value.name,
            bio: editForm.value.bio,
            birthDate: editForm.value.birthDate,
            phoneNumber: editForm.value.phoneNumber,
        })
    }).then((res) => {
        if (res.ok) {
            res.json().then((data) => {
                userStore.setUser(data);
                console.log(data);
            });
        } else {
            res.json().then((error) => {
                console.error('Error:', error);
            });
        }
    }).catch((error) => {
        console.error('Fetch error:', error);
    });
}

function handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        editForm.value.profilePicture = file;
        if (user.value) {
            user.value.profilePicture = { id: user.value.profilePicture?.id || 0, url: URL.createObjectURL(file) };
        }
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
