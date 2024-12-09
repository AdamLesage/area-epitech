import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SuggestionsComponent from '../SuggestionsComponent.vue';

describe('SuggestionsComponent', () => {
    it('renders correctly', () => {
        const wrapper = shallowMount(SuggestionsComponent);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders the correct number of suggestions', () => {
        const wrapper = shallowMount(SuggestionsComponent);
        const suggestions = wrapper.findAll('li');
        expect(suggestions.length).toBe(3);
    });

    it('renders the correct suggestion content', () => {
        const wrapper = shallowMount(SuggestionsComponent);
        const suggestions = wrapper.findAll('li');
        expect(suggestions[0].text()).toContain('📩 Receive merge info by mail (GitHub)');
        expect(suggestions[1].text()).toContain('❤️ Automatically like tweets (Twitter)');
        expect(suggestions[2].text()).toContain('📜 Get daily updates on a subject (RSS Feed)');
    });

    it('renders the Try button for each suggestion', () => {
        const wrapper = shallowMount(SuggestionsComponent);
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBe(3);
        buttons.forEach(button => {
            expect(button.text()).toBe('Try');
        });
    });

    it('has the correct classes for styling', () => {
        const wrapper = shallowMount(SuggestionsComponent);
        const section = wrapper.find('section');
        expect(section.classes()).toContain('bg-indigo-700');
        expect(section.classes()).toContain('rounded-xl');
        expect(section.classes()).toContain('shadow-lg');
        expect(section.classes()).toContain('p-6');
    });
});