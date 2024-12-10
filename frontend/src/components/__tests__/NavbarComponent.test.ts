import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { Icon } from '@iconify/vue';
import Navbar from '../NavbarComponent.vue';

describe('NavbarComponent.vue', () => {
    it('renders the component', () => {
        const wrapper = shallowMount(Navbar);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders the correct number of navigation buttons', () => {
        const wrapper = shallowMount(Navbar);
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBe(4);
    });

    it('renders the correct button names', () => {
        const wrapper = shallowMount(Navbar);
        const buttonNames = wrapper.findAll('button').map(button => button.text());
        expect(buttonNames).toEqual(['Explore', 'My Areas', 'Updates', 'Profile']);
    });
    it('renders icons correctly', () => {
        const wrapper = shallowMount(Navbar);
        const icons = wrapper.findAllComponents(Icon);
        expect(icons.length).toBe(4);
    });
});

