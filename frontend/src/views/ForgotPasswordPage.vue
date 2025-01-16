<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 big:hidden" />
        <div class="absolute top-0 w-full justify-center mobile:!hidden web:hidden big:flex">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary my-4 hover:cursor-pointer z-20" @click="redirectToHomePage">AREA</h1>
        </div>
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <PasswordRetrievalFormComponent
                v-model:email="email"
                @submit="handleSubmit"
                @abort="handleAbort"
                @send-again="handleSendAgain"
                @update:email="handleChangeEmail"
                @update:code="handleChangeCode"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import PasswordRetrievalFormComponent from '@/components/PasswordRetrievalFormComponent.vue';
import { PasswordRetrievalFormValues } from '@/types/auth';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from './../stores/user';
import { fetchUser } from '@/logic/user';
import Cookies from 'js-cookie';
import { watch } from 'vue';


// Email address
const email = ref('');

// Stores
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const tempHide = ref<boolean>(false);
const code = ref<string[]>([]);

initStores();

function checkCode(values: PasswordRetrievalFormValues) {
    const joinedCode = values.code.join('');
    // Call API GET reset-password-confirm
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password-confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            code: joinedCode,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirectUrl) {
            const redirectUrl = data.redirectUrl;
            // redirect to redirectUrl page
            router.push(redirectUrl);
        } else {
            console.error('Redirect URL is undefined');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function redirectToHomePage() {
    console.log('Redirecting to Home Page');
    router.push('/');
};

// Form submission handler
function handleSubmit(values: PasswordRetrievalFormValues) {
    // Call API route /reset-password
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: values.email,
        }),
    })
};

// Abort button handler
function handleAbort() {
    // Redirect to login page
    console.log('User Aborted Forgot Password Verification');
    router.push('/login');
};

// Send again button handler
function handleSendAgain() {
    // Call API route /reset-password
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
        }),
    })
};

function handleChangeEmail(newEmail: string) {
    email.value = newEmail;
}

function handleChangeCode(newCode: string[]) {
    code.value = newCode;
    if (code.value.filter(c => c !== '').length === 6) {
        if (code.value.length === 6 && email.value) {
            checkCode({ email: email.value, code: code.value as [string, string, string, string, string, string] });
        }
    }
}

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
        } else {
            userStore.setUser(user);
            userStore.areas = [];
            email.value = user.email;
        }
    }
}
</script>
