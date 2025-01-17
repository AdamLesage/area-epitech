<script setup lang="ts">
import { ref } from 'vue';
import NavButton from '@/components/NavButton.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePopupStore } from '@/stores/popup';

const popupStore = usePopupStore();
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
    router.push('/explore');
    popupStore.display = true;
}

const handleUserProfileRedirect = () => {
    console.log('Redirecting to user profile');
    router.push('/userinfo');
    popupStore.display = true;
}

function handleWorkshopRedirect() {
    console.log('Redirecting to workshop');
    router.push('/workshop');
    popupStore.display = false;
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
            <NavButton icon="mdi:hammer-screwdriver" text="" @redirect="handleWorkshopRedirect" />
            <img :src="user?.profilePictureUrl || 'default-profile-picture.png'" alt="User profile picture" class="w-12 h-12 rounded-full" @click="handleUserProfileRedirect" v-if="user" />
        </nav>
    </div>
</template>
