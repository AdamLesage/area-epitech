<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <PasswordRetrievalFormComponent
                v-model:email="email"
                @submit="handleSubmit"
                @abort="handleAbort"
                @send-again="handleSendAgain" />
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import PasswordRetrievalFormComponent from '@/components/PasswordRetrievalFormComponent.vue';
import { PasswordRetrievalFormValues } from '@/types/auth';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from './../stores/user';
import { fetchUser } from '@/logic/user';
import Cookies from 'js-cookie';
import { watch } from 'vue';


// Email address
const email = ref('');

// Stores
const userStore = useUserStore();
const route = useRoute();

const tempHide = ref<boolean>(false);

initStores();

watch(email, (newValue) => {
    console.log('Email changed to:', newValue);
});


// Form submission handler
function handleSubmit(values: PasswordRetrievalFormValues) {
    console.log('Forgot Password Form Received:', values);
};

// Abort button handler
function handleAbort() {
    console.log('User Aborted Forgot Password Verification');
};

// Send again button handler
function handleSendAgain() {
    console.log('User requested to send email again');
};

// Watches the route for changes and initializes the stores if necessary
watch(async () => route.fullPath, async (newPath) => {
    if (tempHide.value) {
        tempHide.value = false;
        return;
    }
    if (await newPath === '/') {
        tempHide.value = true;
    }
    await initStores();
})

/**
 * Initializes the stores.
 * 
 * @returns {Promise<void>} A promise that resolves when the stores are initialized.
 */
 async function initStores(): Promise<void> {
    const token = Cookies.get('token');
    console.log('Token:', token);

    if (!userStore.user) {
        const user = await fetchUser(token);
        if (!user) {
            console.log('No user found');
        } else {
            userStore.setUser(user);
            userStore.areas = [];
            email.value = user.email;
        }
    }
}
</script>
