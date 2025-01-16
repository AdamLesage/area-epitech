<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-home font-sans text-white" @click="displayedLinkedAccount = null">
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10 absolute top-0" @click.stop />
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden fixed bottom-0 z-40 bg-home" />
        <div v-if="displayedLinkedAccount" class="bg-black/20 w-screen h-screen absolute justify-center flex items-center z-50">
            <div class="flex flex-col justify-between items-center bg-home rounded-lg p-8 relative">
                <div class="flex items-center gap-2">
                    <Icon :icon="displayedLinkedAccount.icon" class="text-xl w-12 h-12 text-white" />
                    <h3 class="text-lg font-semibold text-white capitalize">{{ displayedLinkedAccount.name }}</h3>
                </div>
                <button @click="displayedLinkedAccount = null" class="rounded-lg absolute top-4 right-4">
                    <Icon icon="mdi:close-circle" class="w-8 h-8 text-home-text-light" />
                </button>
                <button v-if="canDelete(displayedLinkedAccount.name)" @click="deleteLinkedAccount(displayedLinkedAccount)" class="bg-red-500 rounded-lg py-2 px-4 gap-2 my-8 flex items-center">
                    <Icon icon="clarity:disconnect-line" class="w-8 h-8 text-white" />
                    <p class="text-white">Disconnect</p>
                </button>
                <p class="text-home-text-light" v-if="canDelete(displayedLinkedAccount.name)">Disconnecting this account will delete all your AREA's created with it.</p>
                <p class="text-home-text-light mt-6" v-else>Cannot delete this account.</p>
            </div>
        </div>

        <div v-if="!isEditing && user"
            class="bg-home-div mobile:bg-transparent rounded-xl mobile:p-4 p-10 mobile:w-full w-2/3 max-w-[66.75rem] text-center shadow-2xl mobile:shadow-none mt-20 mobile:mt-0 relative">

            <!-- Edit Profile Button -->
            <button @click="toggleEdit"
                class="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 hover:border-white border-2 border-transparent text-white font-bold px-4 py-2 md:px-6 md:py-2 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                aria-label="Edit Profile">
                <Icon icon="bi:pencil-fill" class="w-4 h-4 md:w-5 md:h-5" />
                <span class="hidden md:inline">Edit Profile</span>
            </button>

            <!-- PFP -->
            <img :src="user.profilePictureUrl" alt="Profile Picture"
                class="w-48 h-48 mini:w-24 mini:h-24 rounded-full mb-6 border-4 mobile:border-2 border-white/70 mx-auto shadow-lg" />

            <!-- Username and creation date -->
            <h2 class="mobile:text-xl text-4xl font-semibold tracking-wide mb-2">{{ user.name }}</h2>
            <p class="mobile:text-xs text-sm text-gray-400 font-light">{{ user.bio }}</p>

            <!-- Actions -->
            <div
                class="flex flex-row justify-center items-center mt-8 mobile:mt-6 gap-8 mobile:gap-4 text-center text-gray-300">
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions Created</p>
                </div>
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive ==
                        true).length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions <span class="text-green-500">On</span></p>
                </div>
                <div class="hover:text-white w-[10rem] mobile:w-[7rem]">
                    <h3 class="mobile:text-2xl text-5xl font-extrabold">{{ userStore.areas.filter((a) => a.isActive ==
                        false).length }}</h3>
                    <p class="mobile:text-xs text-base font-light">Actions <span class="text-red-500">Off</span></p>
                </div>
            </div>

            <!-- Connected Platforms -->
            <div class="mobile:!mt-6 mt-12">
                <h3 class="mobile:!text-base text-2xl font-semibold mobile:mb-4 mb-6 tracking-wide">Connected Platforms
                </h3>
                <ConnectedApiIcons :platforms="detailedPlatforms ?? []" @socialClick="handleSocialClick" />
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 justify-center items-center w-full">
                <button @click="goToAddConnections"
                    class="mobile:mt-6 mt-8 mobile:px-4 px-6 py-3 mobile:py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg mobile:text-sm text-white font-bold tracking-wide">
                    Add Connections
                </button>
                <button @click="logout"
                    class="mobile:mt-6 mt-8 mobile:px-4 px-6 py-3 mobile:py-2 bg-red-600 hover:bg-red-700 rounded-full shadow-lg mobile:text-sm text-white font-bold tracking-wide">
                    Logout
                </button>
            </div>
        </div>

        <!-- Edit Profile Card -->
        <div v-else
            class="bg-home-div rounded-xl p-4 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center shadow-2xl transition-transform transform mt-20 mobile:mt-0">
            <h2 class="text-2xl md:text-4xl font-semibold tracking-wide mb-6 mobile:text-xl">Edit Profile</h2>

            <form @submit.prevent="saveProfile" class="space-y-6" :validation-schema="schema">
                <div class="flex flex-col items-center space-y-4">
                    <!-- Avatar Section -->
                    <div class="flex flex-col items-center space-y-4">
                        <!-- Avatar Section -->
                        <div class="relative">
                            <img :src="editForm.profilePictureUrl" alt="Profile Picture"
                                class="w-24 h-24 md:w-32 md:h-32 hover:cursor-pointer rounded-full border-4 border-gray-300 shadow-lg mobile:w-20 mobile:h-20"
                                @click="openPopup" />

                            <!-- Upload Button -->
                            <button type="button" :onclick="openPopup"
                                class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition mobile:w-6 mobile:h-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="white" class="w-4 h-4 mobile:w-3 mobile:h-3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <!-- Popup for Image Selection -->
                        <div v-if="showPopup"
                            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                            <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4">Choose an Image</h3>
                                <div class="grid grid-cols-3 gap-4 justify-center">
                                    <img v-for="(image, index) in images" :key="index" :src="image"
                                        :alt="'Option ' + (index + 1)"
                                        class="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-md w-32 h-32 object-cover mobile:w-24 mobile:h-24"
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
                        <label class="block text-left mb-1 font-semibold mobile:text-sm">Profile Name</label>
                        <input type="text" v-model="editForm.name"
                            class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist mobile:p-1" />
                    </div>
                    <div>
                        <label class="block text-left mb-1 font-semibold mobile:text-sm">Birth Date</label>
                        <input ref="birthDateInput" type="date" :value="editForm.birthDate ? new Date(editForm.birthDate).toISOString().split('T')[0] : ''"
                            @input="editForm.birthDate = new Date(($event?.target as HTMLInputElement)?.value).toISOString()"
                            class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist mobile:p-1" />
                    </div>
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold mobile:text-sm">Phone Number</label>
                    <input type="tel" v-model="editForm.phoneNumber" placeholder="🇫🇷  +33"
                        class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist mobile:p-1"
                        @input="editForm.phoneNumber = editForm.phoneNumber.replace(/[^0-9]/g, '')" />
                </div>
                <div>
                    <label class="block text-left mb-1 font-semibold mobile:text-sm">Bio</label>
                    <textarea v-model="editForm.bio" rows="3"
                        class="w-full p-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none font-geist mobile:p-1"></textarea>
                </div>

                <!-- Buttons -->
                <div class="flex gap-4 justify-center items-center w-full">
                    <button type="submit"
                        class="mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all mobile:mt-4 mobile:px-3 mobile:py-2">
                        Save Changes
                    </button>
                    <button @click="toggleEdit"
                        class="mt-6 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg text-white font-bold tracking-wide transition-all mobile:mt-4 mobile:px-3 mobile:py-2">
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
import MobileServiceNavComponent from "@/components/MobileServiceNavComponent.vue";
import { Icon } from '@iconify/vue';
import * as yup from 'yup';
import { fetchUser, fetchUserAreas } from "@/logic/user";
import axios from 'axios';

const userStore = useUserStore();
const servicesStore = useServiceStore();
const router = useRouter();
const displayedLinkedAccount = ref<null | Platform>(null);

// User Info
const user = ref(userStore.user);

const showPopup = ref(false);
const images = [
    'https://render.fineartamerica.com/images/rendered/default/poster/7.5/8/break/images/artworkimages/medium/3/painting-chimp-profile-animal-monkey-portrait-fac-n-akkash.jpg',
    'https://animalfactguide.com/wp-content/uploads/2020/12/giraffe2-e1724882448817.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQazX23mmRHm5lgOZFbIud3sAtL42CI-ykqw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcuxHZa3v-lXfJ7pht9asToYn0T2iaDZYC-Q&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj99Q4V5JK8HyiS1pB8vdl9YAVkMMNd0izw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX4NAMWyVaJNETPVYdp3cxMy2GZVbEcPqL1Q&s',
    'https://lesminis.fr/blog/wp-content/uploads/2023/11/5-3.jpg.webp',
    'https://media.istockphoto.com/id/473012660/fr/photo/%C3%A9cureuil-gris-b%C3%A2iller.jpg?s=612x612&w=0&k=20&c=8R3bKQCmoFvktQ5q0QsrxcR20HLJNDFKuxsIBLoDzeU=',
    'https://www.zoologiste.com/images/main/cochon.jpg',
];

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
    editForm.value = {
        name: newUser?.name || "",
        bio: newUser?.bio || "",
        birthDate: newUser?.birthDate ? new Date(newUser.birthDate).toISOString().split('T')[0] : "",
        phoneNumber: newUser?.phoneNumber || "",
        profilePictureUrl: newUser?.profilePictureUrl,
    };
});

function canDelete(platformName: string) {
    const cannotDelete = ['gmail', 'timer', 'area'];
    return !cannotDelete.includes(platformName);
}

async function deleteLinkedAccount(platform: Platform) {
    console.log(`Deleting ${platform.name}`);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/linked-account/${platform.name}`;
    console.log(URL);
    try {
        const response = await axios.delete(URL, {
            headers: {
                'Authorization': `Bearer ${user.value?.authToken}`,
            }
        });
        console.log(response.data);
        const authToken = user.value?.authToken;
        userStore.areas = [];
        userStore.user = null;
        userStore.user = await fetchUser(authToken);
        const areas = await fetchUserAreas(authToken);
        for (const area of areas) {
            userStore.addArea(area);
        }
        displayedLinkedAccount.value = null;
    } catch (error) {
        console.error('Error:', error);
    }
}

const schema = yup.object({
    phoneNumber: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
});

const isEditing = ref(false);
console.log(user.value);
const editForm = ref({
    name: user.value?.name || "",
    bio: user.value?.bio || "",
    birthDate: user.value?.birthDate ? new Date(user.value.birthDate).toISOString().split('T')[0] : "",
    phoneNumber: user.value?.phoneNumber || "",
    profilePictureUrl: user.value?.profilePictureUrl,
});

function selectImage(image: string) {
    editForm.value.profilePictureUrl = image;
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

async function saveProfile() {
    // Fetch API to update user details
    console.log(editForm.value);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/${user.value?.uuid}`;
    console.log(URL);
    await fetch(URL, {
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
            profilePictureUrl: editForm.value.profilePictureUrl,
        })
    }).then((res) => {
        if (res.ok) {
            res.json().then((data) => {
                userStore.setUser(data);
                isEditing.value = false;
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
    displayedLinkedAccount.value = detailedPlatforms.value.find((platform) => platform.name === platformName) || null;
}

function goToAddConnections() {
    router.push("/add-connections");
}
</script>
