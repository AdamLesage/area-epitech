import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DetailsFormComponent from '@/components/DetailsFormComponent.vue';

describe('DetailsFormComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(DetailsFormComponent);

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct form fields', () => {
        const wrapper = mount(DetailsFormComponent);

        const username = wrapper.find('input[type="text"]');
        const bio = wrapper.find('textarea');

        expect(username.exists()).toBe(true);
        expect(bio.exists()).toBe(true);
    });

    it('displays the correct title', () => {
        const wrapper = mount(DetailsFormComponent);

        const title = wrapper.find('h1');

        expect(title.text()).toBe('Sign Up');
    });
});
