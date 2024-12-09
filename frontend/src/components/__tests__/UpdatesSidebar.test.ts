import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { Icon } from '@iconify/vue';
import UpdatesSidebar from '../UpdatesSidebar.vue';
describe('UpdatesSidebar.vue', () => {
    it('renders updates when passed', () => {
        const updates = [
            { id: 1, content: 'Update 1' },
            { id: 2, content: 'Update 2' }
        ];
        const wrapper = shallowMount(UpdatesSidebar, {
            props: { updates }
        });
        expect(wrapper.findAll('div[aria-label^="Update:"]').length).toBe(updates.length);
    });

    it('renders the correct content for each update', () => {
        const updates = [
            { id: 1, content: 'Update 1' },
            { id: 2, content: 'Update 2' }
        ];
        const wrapper = shallowMount(UpdatesSidebar, {
            props: { updates }
        });
        updates.forEach((update, index) => {
            expect(wrapper.findAll('div[aria-label^="Update:"]').at(index)?.text()).toBe(update.content);
        });
    });

    it('applies the correct classes to each update', () => {
        const updates = [
            { id: 1, content: 'Update 1' },
            { id: 2, content: 'Update 2' }
        ];
        const wrapper = shallowMount(UpdatesSidebar, {
            props: { updates }
        });
        wrapper.findAll('div[aria-label^="Update:"]').forEach(updateWrapper => {
            expect(updateWrapper.classes()).toContain('bg-indigo-700');
            expect(updateWrapper.classes()).toContain('p-4');
            expect(updateWrapper.classes()).toContain('rounded-lg');
            expect(updateWrapper.classes()).toContain('shadow-md');
            expect(updateWrapper.classes()).toContain('text-left');
            expect(updateWrapper.classes()).toContain('transition-transform');
            expect(updateWrapper.classes()).toContain('transform');
            expect(updateWrapper.classes()).toContain('hover:scale-105');
            expect(updateWrapper.classes()).toContain('hover:bg-indigo-600');
        });
    });
});
