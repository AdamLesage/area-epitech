<script setup lang="ts">
import { ref } from 'vue';
import NavButton from '@/components/NavButton.vue';
import UserSvgComponent from './UserSvgComponent.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = ref(userStore.user);

// Interval for fetching user profilePicture
setInterval(() => {
    if (!userStore.user) return;
    if (!userStore.user.profilePictureUrl) return;
    if (user.value)
        user.value.profilePictureUrl = userStore.user?.profilePictureUrl;
}, 2500);

const router = useRouter();

const emit = defineEmits(['back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    window.scrollTo(0, 0);
    router.push('/explore');
}

const handleUserProfileRedirect = () => {
    if (!user.value) {
        console.error('User not found, redirection aborted');
        return;
    }
    console.log('Redirecting to user profile');
    window.scrollTo(0, 0);
    router.push('/userinfo');
}

function handleWorkshopRedirect() {
    console.log('Redirecting to workshop');
    window.scrollTo(0, 0);
    router.push('/workshop');
}

const handleBackButton = () => {
    console.log('Back button clicked');
    emit('back-button');
}
</script>

<template>
    <div class="w-full p-4 justify-center flex flex-col items-center gap-4">
        <div class="bg-white w-1/6 h-1 rounded-full" />
        <nav class="flex justify-around items-center w-full">
            <NavButton icon="ion:chevron-back-circle-sharp" text="" @click="handleBackButton" />
            <NavButton icon="material-symbols:explore-rounded" text="" @redirect="handleExploreRedirect" />
            <NavButton icon="mdi:hammer-screwdriver" text="" @redirect="handleWorkshopRedirect" v-if="user" />
            <img
                v-if="user && user.profilePictureUrl"
                :src="user?.profilePictureUrl" alt="User profile picture" class="w-12 h-12 rounded-full hover:opacity-90 hover:cursor-pointer border-white border-2 object-cover" @click="handleUserProfileRedirect" />
            <UserSvgComponent color="white" class="w-12 h-12 hover:opacity-90 hover:cursor-pointer" @click="handleUserProfileRedirect" v-else-if="user" />
        </nav>
    </div>
</template>
