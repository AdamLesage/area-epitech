import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import LoginFormComponent from '@/components/LoginFormComponent.vue';

describe('LoginFormComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(LoginFormComponent);

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct form fields', () => {
        const wrapper = mount(LoginFormComponent);

        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });
});
