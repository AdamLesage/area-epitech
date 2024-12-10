<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';

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
</script>

<template>
    <div class="w-full p-4">
        <nav class="flex justify-between items-center w-full">
            <BackButton color="white" class="hover:cursor-pointer" @click="handleBackButton" />
            <div class="flex gap-8">
                <NavButton icon="material-symbols:explore-rounded" text="Explore" @redirect="handleExploreRedirect" />
                <NavButton icon="material-symbols:folder-outline" text="My Areas" @redirect="handleMyAreasRedirect" />
                <NavButton icon="mdi:bell-outline" text="Updates" @redirect="handleUpdatesRedirect" />
                <NavButton icon="carbon:user-avatar-filled" text="" @redirect="handleUserProfileRedirect" />
            </div>
        </nav>
    </div>
</template>
