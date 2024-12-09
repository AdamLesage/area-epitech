import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PasswordChangeFormComponent from '@/components/PasswordChangeFormComponent.vue';

describe('PasswordChangeFormComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(PasswordChangeFormComponent);

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct form fields', () => {
        const wrapper = mount(PasswordChangeFormComponent);

        const passwordInput = wrapper.find('input[type="password"]');
        const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]');
        const submitButton = wrapper.find('button[type="submit"]');
        const abortButton = wrapper.find('button[type="button"]');

        expect(passwordInput.exists()).toBe(true);
        expect(confirmPasswordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
        expect(abortButton.exists()).toBe(true);
    });

    it('displays the correct title', () => {
        const wrapper = mount(PasswordChangeFormComponent);

        const title = wrapper.find('h1');

        expect(title.text()).toBe('Change Password');
    });
});
