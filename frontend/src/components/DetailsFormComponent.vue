<template>
    <div class="web:bg-white web:w-[32rem] mobile:w-[22rem] web:py-6 mobile:pb-6 mobile:h-full px-4 rounded-[1.5rem] web:gap-8 mobile:gap-4 flex flex-col justify-start web:min-h-[20rem]">
        <div class="flex flex-col justify-between h-full">
            <header class="flex flex-col gap-4 mb-4">
                <h1 class="text-center text-3xl font-bold web:text-auth-primary mobile:text-white">Sign Up</h1>
                <h2 class="text-center web:text-auth-primary mobile:text-white">Those details help us create a better experience for you.</h2>
            </header>
            <Form
                class="flex flex-col px-4 h-5/6 justify-between gap-4"
                :validation-schema="schema"
                @submit="onSubmit"
                :initial-values="initialValues">
                <div class="flex flex-col mobile:gap-8 web:gap-4">
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
                </div>
                <div class="flex flex-col gap-2">
                    <!-- Validate Button -->
                    <button
                        type="submit"
                        class="web:bg-auth-primary mobile:bg-auth-tertiary text-white p-2 rounded-lg hover:cursor-pointer">
                        Validate
                    </button>
                    <!-- Skip Button -->
                    <button
                        class="web:text-auth-primary mobile:text-white p-2 rounded-lg hover:cursor-pointer mx-4"
                        @click="skip">
                        Skip
                    </button>
                </div>
            </Form>
        </div>
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
