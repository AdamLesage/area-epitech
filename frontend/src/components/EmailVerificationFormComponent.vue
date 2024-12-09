<template>
    <div class="web:bg-white web:w-[32rem] mobile:w-[22rem] web:py-6 mobile:pb-6 mobile:h-full px-4 rounded-[1.5rem] web:gap-8 mobile:gap-4 flex flex-col justify-start web:min-h-[20rem]">
        <div class="flex flex-col justify-between h-full">
            <header class="flex flex-col gap-4 mb-4">
                <h1 class="text-center text-3xl font-bold web:text-auth-primary mobile:text-white">Email Verification</h1>
                <h2 class="text-center web:text-auth-primary mobile:text-white">We have sent a 6 digits code to your email.</h2>
            </header>
            <Form
                class="flex flex-col px-4 h-5/6 justify-between gap-4"
                :validation-schema="schema"
                @submit="onSubmit"
                :initial-values="initialValues">
                <!-- Code Field -->
                <div class="flex flex-col justify-center items-center space-x-2">
                    <div class="flex justify-between">
                        <Field
                            name="code"
                            type="text"
                            v-model="code"
                            maxlength="6">
                            <input
                                v-for="(_, index) in 6"
                                :key="index"
                                v-model="code[index]"
                                type="text"
                                class="w-[15%] h-16 text-center border-2 border-auth-neutral placeholder:text-auth-neutral rounded-md"
                                maxlength="1"
                                @input="handleInput(index)"
                                @keydown.backspace="handleBackspace(index, $event)" />
                        </Field>
                    </div>
                    <ErrorMessage name="code" class="text-red-500 text-sm mt-1 text-center" />
                </div>
                <!-- Email Recap Field : disabled -->
                <div class="flex flex-col">
                    <label for="email" class="web:text-auth-primary mobile:text-white mb-2">Your email:</label>
                    <Field
                        name="email"
                        type="email"
                        :value="props.email"
                        placeholder="No email provided..."
                        class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral text-auth-neutral rounded-lg w-full cursor-not-allowed bg-white"
                        disabled />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="flex flex-col gap-2">
                    <!-- Validate Button -->
                    <h2 class="text-center web:text-auth-primary mobile:text-white mb-8 mt-8">Not received? <span class="font-bold hover:cursor-pointer hover:underline" @click="sendAgain">Send Again</span></h2>
                    <button
                        type="submit"
                        class="web:bg-auth-primary mobile:bg-auth-tertiary text-white p-2 rounded-lg hover:cursor-pointer">
                        Validate
                    </button>
                    <!-- Abort Button -->
                    <button
                        type="button"
                        class="web:text-auth-primary mobile:text-white p-2 rounded-lg hover:cursor-pointer mx-4"
                        @click="abort">
                        Abort
                    </button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Field, Form, ErrorMessage, SubmissionHandler, GenericObject } from 'vee-validate';

import * as yup from 'yup';
import { EmailVerificationFormValues } from '@/types/auth';

const props = defineProps<{ email: string }>();

// Form state
const code = ref<[string, string, string, string, string, string]>(['', '', '', '', '', '']);

// Form validation schema
const schema = yup.object({
  code: yup.array().required('Code is required').of(yup.string().length(1, 'Code must be 6 digits').matches(/^\d+$/, 'Code must contain only digits')),
  email: yup.string().required('Email is required').email(),
});

// Form initial values
const initialValues: EmailVerificationFormValues = {
    code: ['','','','','',''],
    email: props.email,
};

// Input focus
const handleInput = (index: number) => {
    const inputs = document.querySelectorAll('input');
    if (index < 5 && code.value[index].length === 1) {
        inputs[index + 1].focus();
    }
};

// Backspace focus
const handleBackspace = (index: number, event: KeyboardEvent) => {
    const inputs = document.querySelectorAll('input');
    if (index > 0 && code.value[index].length === 0 && event.key === 'Backspace') {
        inputs[index - 1].focus();
    }
};

// Form submission
const emit = defineEmits(['submit', 'abort', 'send-again']);

const onSubmit: SubmissionHandler<EmailVerificationFormValues, GenericObject, unknown> = (values) => {
    console.log('Form Submitted:', values);
    emit('submit', values);
};

// Abort button
const abort = () => {
    emit('abort');
};

// Send again button
const sendAgain = () => {
    emit('send-again');
};
</script>

<style scoped>
</style>
