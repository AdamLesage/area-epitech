<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';

const emit = defineEmits([
    'redirect-explore',
    'redirect-user-profile',
    'back-button']);

const handleExploreRedirect = () => {
    console.log('Redirecting to explore');
    emit('redirect-explore');
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
    <div class="w-full p-4 justify-center flex flex-col items-center gap-4">
        <div class="bg-white w-1/6 h-1 rounded-full" />
        <nav class="flex justify-around items-center w-full">
            <NavButton icon="ion:chevron-back-circle-sharp" text="" @click="handleBackButton" />
            <NavButton icon="material-symbols:explore-rounded" text="" @redirect="handleExploreRedirect" />
            <NavButton icon="carbon:user-avatar-filled" text="" @redirect="handleUserProfileRedirect" />
        </nav>
    </div>
</template>
