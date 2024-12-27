<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

const emit = defineEmits([
    'redirect-explore',
    'redirect-my-areas',
    'redirect-updates',
    'redirect-user-profile',
    'back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    emit('redirect-explore');
}

const handleMyAreasRedirect = () => {
    console.log('Redirecting to my areas');
    emit('redirect-my-areas');
}

const handleUpdatesRedirect = () => {
    console.log('Redirecting to updates');
    emit('redirect-updates');
}

const handleUserProfileRedirect = () => {
    console.log('Redirecting to user profile');
    emit('redirect-user-profile');
}

const handleBackButton = () => {
    console.log('Back button clicked');
    emit('back-button');
}

const router = useRouter();
const route = useRoute();

function redirectToService() {
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
    logo: string,
    title: string,
}>();
</script>

<template>
    <div class="w-full p-4">
        <nav class="flex justify-between items-center w-full">
            <div class="flex justify-start w-1/3">
                <BackButton color="white" class="hover:cursor-pointer" @click="handleBackButton" />
            </div>
            <div class="flex items-center w-1/3 justify-center gap-2">
                <Icon :icon="props.logo" class="w-[3rem] h-[3rem] text-white hover:cursor-pointer" @click="redirectToService" />
                <div class="flex flex-col justify-end items-center">
                    <h1 class="text-white text-[3rem] leading-[2.5rem] font-bold hover:cursor-pointer select-none" @click="redirectToService">{{ props.title }}</h1>
                </div>
            </div>
            <div class="flex gap-8 w-1/3 justify-end">
                <NavButton icon="material-symbols:explore-rounded" text="Explore" @redirect="handleExploreRedirect" />
                <NavButton icon="material-symbols:folder-outline" text="My Areas" @redirect="handleMyAreasRedirect" />
                <NavButton icon="mdi:bell-outline" text="Updates" @redirect="handleUpdatesRedirect" />
                <NavButton icon="carbon:user-avatar-filled" text="" @redirect="handleUserProfileRedirect" />
            </div>
        </nav>
    </div>
</template>
