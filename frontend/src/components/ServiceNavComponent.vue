<script setup lang="ts">
import { watch, ref } from 'vue';
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePopupStore } from '@/stores/popup';

const popupStore = usePopupStore();
const userStore = useUserStore();
const user = ref(userStore.user);

watch(() => userStore.user, (newUser) => {
    user.value = newUser;
});

const router = useRouter();
const emit = defineEmits([
    'back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    window.scrollTo(0, 0);
    router.push('/explore');
    popupStore.display = true;
}

const handleMyAreasRedirect = () => {
    console.log('Redirecting to dashboard');
    window.scrollTo(0, 0);
    router.push('/dashboard');
    popupStore.display = true;
}

const handleWorkshopRedirect = () => {
    console.log('Redirecting to workshop');
    window.scrollTo(0, 0);
    router.push('/workshop');
    popupStore.display = false;
}

const handleUserProfileRedirect = () => {
    console.log('Redirecting to user profile');
    window.scrollTo(0, 0);
    router.push('/userinfo');
    popupStore.display = true;
}

const handleBackButton = () => {
    console.log('Back button clicked');
    emit('back-button');
}
</script>

<template>
    <div class="w-full p-4">
        <nav class="flex justify-between items-center w-full">
            <BackButton color="white" class="hover:cursor-pointer" @click="handleBackButton" />
            <div class="flex gap-8">
                <NavButton icon="material-symbols:explore-rounded" text="Explore" @redirect="handleExploreRedirect" />
                <NavButton icon="material-symbols:folder-outline" text="My Area" @redirect="handleMyAreasRedirect" v-if="user" />
                <NavButton icon="mdi:hammer-screwdriver" text="Workshop" @redirect="handleWorkshopRedirect" v-if="user" />
                <img :src="user?.profilePictureUrl || 'default-profile-picture.png'" alt="User profile picture" class="w-12 h-12 rounded-full hover:opacity-90 hover:cursor-pointer border-white border-2" @click="handleUserProfileRedirect" v-if="user" />
            </div>
        </nav>
    </div>
</template>
