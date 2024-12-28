<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';

const userStore = useUserStore();
const user = userStore.user;

const router = useRouter();
const route = useRoute();
const emit = defineEmits([
    'back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    window.scrollTo(0, 0);
    router.push('');
}

const handleMyAreasRedirect = () => {
    console.log('Redirecting to my areas');
    window.scrollTo(0, 0);
    router.push('/areas');
}

const handleWorkshopRedirect = () => {
    console.log('Redirecting to workshop');
    window.scrollTo(0, 0);
    router.push('/workshop');
}

const handleUpdatesRedirect = () => {
    console.log('Redirecting to updates');
    window.scrollTo(0, 0);
    router.push('');
}

const handleUserProfileRedirect = () => {
    console.log('Redirecting to user profile');
    window.scrollTo(0, 0);
    router.push('/userinfo');
}

const handleBackButton = () => {
    console.log('Back button clicked');
    emit('back-button');
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
</script>

<template>
    <div class="w-full p-4">
        <nav class="flex justify-between items-center w-full">
            <div class="flex justify-start w-1/3">
                <BackButton color="white" class="hover:cursor-pointer" @click="handleBackButton" />
            </div>
            <div class="flex items-center w-1/3 justify-center gap-2">
                <Icon :icon="props.logo" class="w-[3rem] h-[3rem] text-white hover:cursor-pointer" @click="redirectToService" v-if="props.logo" />
                <div class="flex flex-col justify-end items-center" v-if="props.title">
                    <h1 class="text-white text-[3rem] leading-[2.5rem] font-bold hover:cursor-pointer select-none" @click="redirectToService">{{ props.title }}</h1>
                </div>
            </div>
            <div class="flex gap-8 w-1/3 justify-end">
                <NavButton icon="material-symbols:explore-rounded" text="Explore" @redirect="handleExploreRedirect" />
                <NavButton icon="material-symbols:folder-outline" text="My Areas" @redirect="handleMyAreasRedirect" v-if="user" />
                <NavButton icon="mdi:hammer-screwdriver" text="Workshop" @redirect="handleWorkshopRedirect" v-if="user" />
                <NavButton icon="carbon:user-avatar-filled" text="" @redirect="handleUserProfileRedirect" v-if="user" />
            </div>
        </nav>
    </div>
</template>
