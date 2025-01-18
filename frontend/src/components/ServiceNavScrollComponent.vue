<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import UserSvgComponent from './UserSvgComponent.vue';

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
const route = useRoute();
const emit = defineEmits([
    'back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    window.scrollTo(0, 0);
    router.push('/explore');
}

const handleMyAreasRedirect = () => {
    console.log('Redirecting to dashboard');
    window.scrollTo(0, 0);
    router.push('/dashboard');
}

const handleWorkshopRedirect = () => {
    console.log('Redirecting to workshop');
    window.scrollTo(0, 0);
    router.push('/workshop');
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

const handleBackButton = () => {
    console.log('Back button clicked');
    emit('back-button');
}

function openMenu() {
    console.log('Toggling menu');
    showMenu.value = !showMenu.value;
}

function redirectToService() {
    if (!props.redirect) {
        console.error('Redirect not allowed');
        return;
    }
    if (!props.title) {
        console.error('No title found');
        return;
    }
    console.log('Redirecting to service');
    if (route.path === `/service/${props.title.toLowerCase()}`) {
        console.log('Scrolling to top');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return;
    }
    console.log('Redirecting to service:', props.title);
    window.scrollTo(0, 0);
    router.push(`/service/${props.title.toLowerCase()}?header=false`);
    window.scrollTo(0, 0);
}

const props = defineProps<{
    logo: string | null,
    title: string | null,
    redirect: boolean | true,
}>();

const showMenu = ref<boolean>(false);
</script>

<template>
    <div class="w-full p-4"
        :class="{ 'shadow-xl': showMenu }">
        <nav class="flex justify-between items-center w-full">
            <div class="flex justify-start w-1/3">
                <BackButton color="white" class="hover:cursor-pointer" @click="handleBackButton" />
            </div>
            <div class="flex items-center w-1/3 justify-center gap-2">
                <Icon :icon="props.logo" class="w-[3rem] h-[3rem] text-white hover:cursor-pointer" @click="redirectToService" v-if="props.logo" />
                <div class="flex flex-col justify-end items-center" v-if="props.title">
                    <h1 class="text-white text-[3rem] half:!text-[2rem] leading-[2.5rem] half:!leading-3 font-bold hover:cursor-pointer select-none" @click="redirectToService">{{ props.title }}</h1>
                </div>
            </div>
            <div class="flex gap-8 w-1/3 justify-end">
                <NavButton icon="material-symbols:explore-rounded" class="half:hidden" text="Explore" @redirect="handleExploreRedirect" />
                <NavButton icon="material-symbols:folder-outline" class="half:hidden" text="My Area" @redirect="handleMyAreasRedirect" v-if="user" />
                <NavButton icon="mdi:hammer-screwdriver" class="half:hidden" text="Workshop" @redirect="handleWorkshopRedirect" v-if="user" />
                <NavButton icon="mdi:menu" class="hidden half:flex" text="Menu" @redirect="openMenu" />
                <img
                    v-if="user && user.profilePictureUrl"
                    :src="user?.profilePictureUrl" alt="User profile picture" class="w-12 h-12 rounded-full hover:opacity-90 hover:cursor-pointer border-white border-2 object-cover" @click="handleUserProfileRedirect" />
                <UserSvgComponent color="white" class="w-12 h-12 hover:opacity-90 hover:cursor-pointer" @click="handleUserProfileRedirect" v-else-if="user" />
            </div>
        </nav>
        <div v-if="showMenu" class="mt-6 text-white text-xl hidden half:flex flex-col items-center bg-black/10 rounded-md py-4 gap-2">
            <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2 items-center flex gap-2" @click="handleExploreRedirect"><Icon icon="material-symbols:explore-rounded" class="w-5 h-5" />Explore</h1>
            <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2 items-center flex gap-2" @click="handleMyAreasRedirect" v-if="user"><Icon icon="material-symbols:folder-outline" class="w-5 h-5" />My Area</h1>
            <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2 items-center flex gap-2" @click="handleWorkshopRedirect" v-if="user"><Icon icon="mdi:hammer-screwdriver" class="w-5 h-5" />Workshop</h1>
            <h1 class="text-xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer hover:underline decoration-2 items-center flex gap-2" @click="handleUserProfileRedirect" v-if="user"><Icon icon="carbon:user-avatar-filled" class="w-5 h-5" />My Profile</h1>
        </div>
    </div>
</template>
