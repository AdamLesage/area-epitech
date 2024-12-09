import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PasswordRetrievalFormComponent from '@/components/PasswordRetrievalFormComponent.vue';

describe('PasswordRetrievalFormComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(PasswordRetrievalFormComponent);

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct form fields', () => {
        const wrapper = mount(PasswordRetrievalFormComponent);

        const email = wrapper.find('input[type="email"]');
        const codeInputs = wrapper.findAll('input[type="text"]');
        const submitButton = wrapper.find('button[type="submit"]');
        const sendAgainSpan = wrapper.find('span');
        const abortButton = wrapper.find('button[type="button"]');

        expect(email.exists()).toBe(true);
        expect(codeInputs.length).toBe(6);
        expect(submitButton.exists()).toBe(true);
        expect(sendAgainSpan.exists()).toBe(true);
        expect(abortButton.exists()).toBe(true);
    });

    it('displays the correct title', () => {
        const wrapper = mount(PasswordRetrievalFormComponent);

        const title = wrapper.find('h1');

        expect(title.text()).toBe('Password Retrieval');
    });
});
