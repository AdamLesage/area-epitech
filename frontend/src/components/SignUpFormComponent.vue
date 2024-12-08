<template>
    <div class="web:bg-white web:w-[32rem] mobile:w-[22rem] web:py-6 mobile:pb-6 mobile:h-full px-4 rounded-[1.5rem] web:gap-8 mobile:gap-4 flex flex-col justify-start web:min-h-[44rem]">
        <div class="flex flex-col justify-between h-full">
            <header class="flex flex-col gap-4">
                <h1 class="text-center text-3xl font-bold web:text-auth-primary mobile:text-white">Sign up</h1>
                <h2 class="text-center web:text-auth-primary mobile:text-white">Please enter your details to sign up.</h2>
            </header>
            <div class="flex-wrap flex web:gap-x-8 mobile:gap-x-4 gap-y-4 justify-center">
                <AuthButton icon="mdi:github" color="black" @click="authWithGithub" />
                <AuthButton icon="prime:twitter" color="black" @click="authWithTwitter" />
                <AuthButton icon="ic:baseline-apple" color="black" @click="authWithApple" />
                <AuthButton icon="flat-color-icons:google" color="" @click="authWithGoogle" />
                <AuthButton icon="logos:microsoft-icon" color="blue" @click="authWithMicrosoft" />
            </div>
            <div class="flex justify-between items-center px-4">
                <span class="w-2/5 web:bg-auth-neutral mobile:bg-auth-secondary h-0.5 rounded-md"></span>
                <span class="w-1/5 web:text-auth-neutral text-center font-semibold mobile:text-white">OR</span>
                <span class="w-2/5 web:bg-auth-neutral mobile:bg-auth-secondary h-0.5 rounded-md"></span>
            </div>
            <Form
                class="flex flex-col px-4 h-1/2 justify-between min-h-[20rem]"
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
                <div>
                    <div class="flex gap-0.5 relative">
                        <div
                            class="w-2 h-11 rounded-l-lg"
                            :class="passwordState == 0 ? 'bg-red-500' : passwordState == 1 ? 'bg-orange-500' : 'bg-green-500'"
                            @mouseover="showTooltip = true"
                            @mouseleave="showTooltip = false">
                        </div>
                        <div
                            v-if="showTooltip"
                            class="absolute bottom-12 left-0 bg-gray-700 text-white text-sm p-2 rounded-md">
                            For a stronger password, include at least one lowercase letter, one uppercase letter, one number, and one symbol.
                        </div>
                        <Field
                            name="password"
                            :type="showPassword[0] ? 'text' : 'password'"
                            v-model="password"
                            placeholder="•••••••••••••"
                            class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-r-lg w-full pr-8"
                            :class="showPassword[0] ? 'tracking-[0px]' : 'tracking-[5px]'" />
                        <Icon
                            icon="solar:eye-outline"
                            class="w-6 h-6 my-2.5 text-auth-neutral hover:cursor-pointer absolute right-2"
                            @click.prevent="togglePasswordVisibility(0)" />
                    </div>
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- Confirm Password Field -->
                <div>
                    <div class="flex gap-0.5 relative">
                        <div class="w-2 h-11 rounded-l-lg"
                            :class="confirmPasswordState == 0 ? 'bg-red-500' : 'bg-green-500'"
                            @mouseover="showTooltipConf = true"
                            @mouseleave="showTooltipConf = false">
                        </div>
                        <div
                            v-if="showTooltipConf"
                            class="absolute bottom-12 left-0 bg-gray-700 text-white text-sm p-2 rounded-md">
                            Passwords must match.
                        </div>
                        <Field
                            name="confirmPassword"
                            :type="showPassword[1] ? 'text' : 'password'"
                            v-model="confirmPassword"
                            placeholder="•••••••••••••"
                            class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-r-lg w-full pr-8"
                            :class="showPassword[1] ? 'tracking-[0px]' : 'tracking-[5px]'" />
                        <Icon
                            icon="solar:eye-outline"
                            class="w-6 h-6 my-2.5 text-auth-neutral hover:cursor-pointer absolute right-2"
                            @click.prevent="togglePasswordVisibility(1)" />
                    </div>
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- Terms and Conditions -->
                <div>
                    <div class="flex items-center gap-2">
                        <Field
                            name="terms"
                            id="terms"
                            type="checkbox"
                            :value="true"
                            :unchecked-value="false"
                            :initial-value="false"
                            v-model="terms"
                            class="mobile:w-8 mobile:h-8" />
                        <label for="terms" class="mobile:text-auth-secondary mobile:text-sm">
                            I agree to the 
                            <router-link to="" class="underline hover:cursor-pointer" @click.prevent>Terms</router-link>
                            and 
                            <router-link to="" class="underline hover:cursor-pointer" @click.prevent>Conditions</router-link>
                        </label>
                    </div>
                    <ErrorMessage name="terms" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- Sign Up Button -->
                <div class="flex flex-col gap-3">
                    <button
                        type="submit"
                        class="web:bg-auth-primary mobile:bg-auth-tertiary text-white p-2 rounded-lg hover:cursor-pointer">
                        Sign Up
                    </button>
                    <h2 class="text-center mobile:text-white">Already have an account? <router-link to="/login" class="text-auth-primary hover:underline hover:cursor-pointer mobile:text-white mobile:font-bold">Login</router-link></h2>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Field, Form, ErrorMessage, SubmissionHandler, GenericObject } from 'vee-validate';

import { Icon } from '@iconify/vue';
import AuthButton from '@/components/AuthButton.vue';
import * as yup from 'yup';
import { SignUpFormValues } from '@/types/auth';

// Form state
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const terms = ref<boolean>(false);
const showPassword = ref<[boolean, boolean]>([false, false]);

// Tooltip state
const showTooltip = ref<boolean>(false);
const showTooltipConf = ref<boolean>(false);

// Computed state for password variable
const passwordState = computed(() => {
    if (password.value.length < 8) return 0;

    let upper = 0, lower = 0, special = 0, number = 0;
    for (let i = 0; i < password.value.length; i++) {
        if (password.value[i].match(/[A-Z]/)) upper++;
        else if (password.value[i].match(/[a-z]/)) lower++;
        else if (password.value[i].match(/[!@#$%^&*(),.?":{}|<>]/)) special++;
        else if (password.value[i].match(/[0-9]/)) number++;
    }
    if (upper === 0 || lower === 0 || special === 0 || number === 0) return 1;
    return 2;
});

// Computed state for password confirmation
const confirmPasswordState = computed(() => {
    if (confirmPassword.value.length === 0) return 0;
    return confirmPassword.value === password.value ? 1 : 0;
});

// Password visibility toggle
const togglePasswordVisibility = (index: number) => {
    showPassword.value[index] = !showPassword.value[index];
};

// Form validation schema
const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .min(8, 'Password must be at least 8 characters')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms and Conditions')
    .required('You must accept the Terms and Conditions'),
});

// Form initial values
const initialValues: SignUpFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
};

// Form submission
const emit = defineEmits(['submit']);

const onSubmit: SubmissionHandler<SignUpFormValues, GenericObject, unknown> = (values) => {
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
