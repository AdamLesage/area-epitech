import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SignUpButton from '../SignUpButton.vue';

describe('SignUpButton', () => {
    it('accepts color prop and applies it to SVG path', () => {
        const color = 'red';
        const wrapper = shallowMount(SignUpButton, {
            props: {
                color,
            },
        });

        const path = wrapper.find('svg path');

        expect(path.exists()).toBe(true);
        expect(path.attributes('fill')).toBe(color);
    });
});
