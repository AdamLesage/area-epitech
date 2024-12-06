<script setup lang="ts">
import LoginFormComponent from '@/components/LoginFormComponent.vue';
import LogoComponent from '@/components/LogoComponent.vue';
import SignUpButton from '@/components/SignUpButton.vue';

import { ref } from 'vue';

const signupHover = ref(false);
</script>

<template>
    <div class="bg-auth-primary w-20 h-20 hover:cursor-pointer">
        <LogoComponent color="#80C4E9" class="hover:cursor-pointer"/>
        <LoginFormComponent />
        <SignUpButton
            class="hover:cursor-pointer"
            :color="signupHover ? 'black' : 'white'"
            @mouseover="signupHover = true"
            @mouseleave="signupHover = false" />
    </div>
</template>

<style scoped>
</style>
