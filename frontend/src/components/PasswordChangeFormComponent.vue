<template>
    <div class="bg-white w-[32rem] pt-6 pb-2 px-4 rounded-[1.5rem] gap-2 flex flex-col">
        <header class="mb-6">
            <h1 class="text-center text-3xl font-bold text-auth-primary">Change Password</h1>
            <h2 class="text-center text-auth-primary">Change your password.</h2>
        </header>
        <Form
            class="flex flex-col gap-4 px-4"
            :validation-schema="schema"
            @submit="onSubmit"
            :initial-values="initialValues">
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
            <!-- Submit Button -->
            <div class="flex flex-col gap-3">
                <button
                    type="submit"
                    class="bg-auth-primary text-white p-2 rounded-lg hover:cursor-pointer">
                    Submit
                </button>
            </div>
        </Form>
        <!-- Abort Button -->
        <button
            type="button"
            class="text-auth-primary p-2 rounded-lg hover:cursor-pointer mx-4"
            @click="abort">
            Abort
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Field, Form, ErrorMessage, SubmissionHandler, GenericObject } from 'vee-validate';

import { Icon } from '@iconify/vue';
import * as yup from 'yup';
import { PasswordChangeFormValues } from '@/types/auth';

// Form state
const password = ref<string>('');
const confirmPassword = ref<string>('');
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
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .min(8, 'Password must be at least 8 characters')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Form initial values
const initialValues: PasswordChangeFormValues = {
    password: '',
    confirmPassword: '',
};

// Form submission
const emit = defineEmits(['submit', 'abort']);

const onSubmit: SubmissionHandler<PasswordChangeFormValues, GenericObject, unknown> = (values) => {
    console.log('Form Submitted:', values);
    emit('submit', values);
};

// Abort button
const abort = () => {
    emit('abort');
};
</script>

<style scoped>
</style>
