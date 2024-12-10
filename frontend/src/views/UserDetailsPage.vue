<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import DetailsFormComponent from '@/components/DetailsFormComponent.vue';
import { DetailsFormValues } from '@/types/auth';
import { useUserStore } from '@/stores/users';
import { User } from '@/types/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const store = useUserStore();
const router = useRouter();

const user = store.user;
if (!user) {
    console.error('Not logged in.');
    router.push('/');
}

// Form submission handler
const handleSubmit = async (values: DetailsFormValues) => {
    console.log('Login Form Received:', values);
    if (!user) {
        console.error('Not logged in.');
        return;
    }
    try {
        const authToken = Cookies.get('token');
        const res: { status: number, data: User } = await axios.put<User>(`http://localhost:8080/api/user/${user.uuid}`, {
            name: values.username,
            bio: values.bio,
        },
        {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log(res);
        if (res.status !== 500) {
            console.log('User modified successfully');
            store.setUser(res.data);
            router.push('/dashboard');
        } else {
            console.log('User registration failed');
        }
    } catch (error) {
        console.error('User registration failed:', error);
    }
};

// Skip button handler
const handleSkip = () => {
    console.log('User skipped profile details');
};
</script>

<template>
    <div class="bg-auth-primary flex justify-center items-center">
        <LogoComponent color="#80C4E9" class="absolute top-0 left-5 half:hidden" />
        <div class="flex flex-col items-center z-10 mobile:justify-between web:justify-center h-full">
            <h1 class="text-[4rem] leading-[3rem] font-black text-auth-secondary web:hidden my-4">AREA</h1>
            <DetailsFormComponent @submit="handleSubmit" @skip="handleSkip" />
        </div>
    </div>
</template>

<style scoped>
</style>
