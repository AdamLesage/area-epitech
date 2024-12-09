import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LogoComponent from '../LogoComponent.vue';

describe('LogoComponent', () => {
    it('accepts props correctly', () => {
        const wrapper = shallowMount(LogoComponent, {
            props: {
                color: 'red',
            },
        });

        expect(wrapper.props('color')).toBe('red');
    });

    it('accepts props correctly 2', () => {
        const wrapper = shallowMount(LogoComponent, {
            props: {
                color: '#eee',
            },
        });

        expect(wrapper.props('color')).toBe('#eee');
    });

    it('doesn\'t add an invalid color', async () => {
        const wrapper = shallowMount(LogoComponent, {
            props: {
                color: '#hhh',
            },
        });

        const logo = wrapper.find('svg path');
        expect(logo.attributes('style')).toBeUndefined();
    });
});
