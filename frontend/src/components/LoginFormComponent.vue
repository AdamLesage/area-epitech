<template>
    <div class="bg-white w-[32rem] py-6 px-4 rounded-lg gap-8 flex flex-col">
        <header>
            <h1 class="text-center text-3xl font-bold text-auth-primary">Welcome back</h1>
            <h2 class="text-center text-auth-primary">Please enter your details to sign in.</h2>
        </header>
        <div class="flex-wrap flex gap-x-8 gap-y-4 justify-center">
            <AuthButton icon="mdi:github" color="black" @click="authWithGithub" />
            <AuthButton icon="prime:twitter" color="black" @click="authWithTwitter" />
            <AuthButton icon="ic:baseline-apple" color="black" @click="authWithApple" />
            <AuthButton icon="flat-color-icons:google" color="" @click="authWithGoogle" />
            <AuthButton icon="logos:microsoft-icon" color="blue" @click="authWithMicrosoft" />
        </div>
        <div class="flex justify-between items-center px-4">
            <span class="w-2/5 bg-auth-neutral h-0.5 rounded-md"></span>
            <span class="w-1/5 text-auth-neutral text-center font-semibold">OR</span>
            <span class="w-2/5 bg-auth-neutral h-0.5 rounded-md"></span>
        </div>
        <Form
            class="flex flex-col gap-4 px-4"
            :validation-schema="schema"
            @submit="onSubmit"
            :initial-values="initialValues">
            <!-- Email Field -->
            <div>
                <Field
                    name="email"
                    type="email"
                    v-model="email"
                    placeholder="Enter your email..."
                    class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-lg w-full" />
                <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
            </div>
            <!-- Password Field -->
            <div class="relative">
                <Field
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder="•••••••••••••"
                    class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-lg w-full pr-8"
                    :class="showPassword ? 'tracking-[0px]' : 'tracking-[5px]'" />
                <Icon
                    icon="solar:eye-outline"
                    class="w-6 h-6 my-2.5 text-auth-neutral hover:cursor-pointer absolute right-2 top-0"
                    @click.prevent="togglePasswordVisibility()" />
                <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
            </div>
            <!-- Remember Me & Forgot Password -->
            <div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Field
                            name="rememberMe"
                            id="rememberMe"
                            type="checkbox"
                            :value="true"
                            :unchecked-value="false"
                            :initial-value="false"
                            v-model="rememberMe"/>
                        <label for="rememberMe">
                            Remember me
                        </label>
                    </div>
                    <router-link to="" class="text-auth-neutral underline hover:cursor-pointer">Forgot Password?</router-link>
                </div>
            </div>
            <!-- Sign In Button -->
            <div class="flex flex-col gap-3">
                <button
                    type="submit"
                    class="bg-auth-primary text-white p-2 rounded-lg hover:cursor-pointer">
                    Sign In
                </button>
                <h2 class="text-center">Don't have an account yet? <router-link to="/signup" class="text-auth-primary hover:underline hover:cursor-pointer">Sign Up</router-link></h2>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Field, Form, ErrorMessage, SubmissionHandler, GenericObject } from 'vee-validate';

import { Icon } from '@iconify/vue';
import AuthButton from '@/components/AuthButton.vue';
import * as yup from 'yup';
import { LoginFormValues } from '@/types/auth';

// Form state
const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);

// Password visibility toggle
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

// Form validation schema
const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: yup.boolean(),
});

// Form initial values
const initialValues: LoginFormValues = {
    email: '',
    password: '',
    rememberMe: false,
};

// Form submission
const emit = defineEmits(['submit']);

const onSubmit: SubmissionHandler<LoginFormValues, GenericObject, unknown> = (values) => {
    console.log('Form Submitted:', values);
    emit('submit', values);
};

// Social authentication functions
const authWithGoogle: () => void = () => console.log('Authenticating with Google...');
const authWithGithub: () => void = () => console.log('Authenticating with GitHub...');
const authWithTwitter: () => void = () => console.log('Authenticating with Twitter...');
const authWithApple: () => void = () => console.log('Authenticating with Apple...');
const authWithMicrosoft: () => void = () => console.log('Authenticating with Microsoft...');
</script>

<style scoped>
</style>
