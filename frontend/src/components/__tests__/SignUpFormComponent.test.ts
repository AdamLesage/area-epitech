import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SignUpFormComponent from '@/components/SignUpFormComponent.vue';
import { useForm, useField } from 'vee-validate'; // Import VeeValidate

describe('SignUpFormComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(SignUpFormComponent);

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct form fields', () => {
        const wrapper = mount(SignUpFormComponent);

        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(confirmPasswordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });
});
