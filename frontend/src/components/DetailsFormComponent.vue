<template>
    <div class="bg-white w-[32rem] pt-6 pb-2 px-4 rounded-[1.5rem] gap-2 flex flex-col">
        <header class="mb-6">
            <h1 class="text-center text-3xl font-bold text-auth-primary">Sign Up</h1>
            <h2 class="text-center text-auth-primary">Those details help us create a better experience for you.</h2>
        </header>
        <Form
            class="flex flex-col gap-4 px-4"
            :validation-schema="schema"
            @submit="onSubmit"
            :initial-values="initialValues">
            <!-- Username Field -->
            <div>
                <Field
                    name="username"
                    type="text"
                    v-model="username"
                    placeholder="Enter your username..."
                    class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-lg w-full" />
            </div>
            <!-- Bio Field -->
            <div class="relative">
                <Field
                    name="bio"
                    type="textarea"
                    v-model="bio"
                    placeholder="Enter a description for your profile..."
                    class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-lg w-full pr-8" >
                    <textarea
                        v-model="bio"
                        placeholder="Enter a description for your profile..."
                        class="p-2 border-2 border-auth-neutral placeholder:text-auth-neutral rounded-lg w-full pr-8 max-h-64 min-h-24" />
                </Field>
            </div>
            <!-- Sign In Button -->
            <button
                type="submit"
                class="bg-auth-primary text-white p-2 rounded-lg hover:cursor-pointer">
                Sign In
            </button>
        </Form>
        <!-- Skip Button -->
        <button
            class="text-auth-primary p-2 rounded-lg hover:cursor-pointer mx-4"
            @click="skip">
            Skip
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Field, Form, SubmissionHandler, GenericObject } from 'vee-validate';

import * as yup from 'yup';
import { DetailsFormValues } from '@/types/auth';

// Form state
const username = ref<string>('');
const bio = ref<string>('');

// Form validation schema
const schema = yup.object({
  username: yup.string(),
  bio: yup.string(),
});

// Form initial values
const initialValues: DetailsFormValues = {
    username: '',
    bio: '',
};

// Form submission
const emit = defineEmits(['submit', 'skip']);

const onSubmit: SubmissionHandler<DetailsFormValues, GenericObject, unknown> = (values) => {
    console.log('Form Submitted:', values);
    emit('submit', values);
};

// Skip button
const skip = () => {
    emit('skip');
};
</script>

<style scoped>
</style>
