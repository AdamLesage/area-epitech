<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <PasswordChangeFormComponent
                @submit="handleSubmit"
                @abort="handleAbort" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PasswordChangeFormComponent from '@/components/PasswordChangeFormComponent.vue';
import LogoComponent from '@/components/LogoComponent.vue';
import { PasswordChangeFormValues } from '@/types/auth';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from './../stores/user';
import { fetchUser } from '@/logic/user';
import Cookies from 'js-cookie';
import { watch } from 'vue';
import { ref } from 'vue';

// Stores
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const tempHide = ref<boolean>(false);
const email = ref<string>('');

// Form submission handler
function handleSubmit(values: PasswordChangeFormValues) {
    // Call API GET reset-password-confirm
    const password = values.password;
    const code = route.query.code;
    console.log('Code:', code);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            password: password,
            code: route.query.code
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        const redirectUrl = data.redirectUrl;
        // redirect to redirectUrl page
        router.push(redirectUrl);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

// Abort button handler
function handleAbort() {
    console.log('User Aborted Email Verification');
};

initStores();

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

    if (!userStore.user) {
        const user = await fetchUser(token);
        if (!user) {
            console.error('No user found');
        } else {
            userStore.setUser(user);
            userStore.areas = [];
            email.value = user.email;
        }
    }
}
</script>
