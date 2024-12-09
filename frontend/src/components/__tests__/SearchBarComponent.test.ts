import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SearchBarComponent from '../SearchBarComponent.vue';
describe('SearchBarComponent', () => {
    it('renders the component correctly', () => {
        const wrapper = shallowMount(SearchBarComponent);
        expect(wrapper.exists()).toBe(true);
    });

    it('has the correct heading', () => {
        const wrapper = shallowMount(SearchBarComponent);
        const heading = wrapper.find('h2');
        expect(heading.text()).toBe('Search');
    });

    it('has an input field', () => {
        const wrapper = shallowMount(SearchBarComponent);
        const input = wrapper.find('input[type="text"]');
        expect(input.exists()).toBe(true);
    });

    it('input field has the correct placeholder', () => {
        const wrapper = shallowMount(SearchBarComponent);
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes('placeholder')).toBe('Search for Areas, Actions, or Suggestions...');
    });

    it('input field has the correct aria-label', () => {
        const wrapper = shallowMount(SearchBarComponent);
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes('aria-label')).toBe('Search input');
    });
});
