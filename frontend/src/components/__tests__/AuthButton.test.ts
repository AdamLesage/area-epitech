import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import AuthButton from '../AuthButton.vue';
import { Icon } from '@iconify/vue';

describe('AuthButton', () => {
    it('accepts props correctly', () => {
        const wrapper = shallowMount(AuthButton, {
            global: {
                components: {
                    Icon,
                },
            },
            props: {
                color: 'red',
                icon: 'hugeicons:bluetooth-square',
            },
        });

        expect(wrapper.props('color')).toBe('red');
        expect(wrapper.props('icon')).toBe('hugeicons:bluetooth-square');

        const icon = wrapper.findComponent(Icon);
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('style')).toContain('color: red');
        expect(icon.attributes('icon')).toBe('hugeicons:bluetooth-square');
    });

    it('accepts props correctly 2', () => {
        const wrapper = shallowMount(AuthButton, {
            global: {
                components: {
                    Icon,
                },
            },
            props: {
                color: '#eee',
                icon: 'openmoji:eyes',
            },
        });

        console.log(wrapper.html());
        expect(wrapper.props('color')).toBe('#eee');
        expect(wrapper.props('icon')).toBe('openmoji:eyes');

        const icon = wrapper.findComponent(Icon);
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('style')).toContain('color: rgb(238, 238, 238)');
        expect(icon.attributes('icon')).toBe('openmoji:eyes');
    });

    it('doesn\'t add an invalid color', async () => {
        const wrapper = shallowMount(AuthButton, {
            global: {
                components: {
                    Icon,
                },
            },
            props: {
                color: '#hhh',
                icon: 'hugeicons:bluetooth-square',
            },
        });

        expect(wrapper.props('color')).toBe('#hhh');
        expect(wrapper.props('icon')).toBe('hugeicons:bluetooth-square');

        const icon = wrapper.findComponent(Icon);
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('style')).toBeUndefined();
        expect(icon.attributes('icon')).toBe('hugeicons:bluetooth-square');
    });
});
