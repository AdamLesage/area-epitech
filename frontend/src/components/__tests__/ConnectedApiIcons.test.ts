import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { Icon } from '@iconify/vue';
import ConnectedApiIcons from '../ConnectedApiIcons.vue';

describe('ConnectedApiIcons.vue', () => {
    const platforms = [
        { name: 'facebook', color: '#3b5998', icon: 'mdi:facebook' },
        { name: 'twitter', color: '#1da1f2', icon: 'mdi:twitter' },
        { name: 'instagram', color: '#e1306c', icon: 'mdi:instagram' },
        { name: 'linkedin', color: '#0077b5', icon: 'mdi:linkedin' },
    ];

    it('renders the correct number of buttons', () => {
        const wrapper = shallowMount(ConnectedApiIcons, {
            props: { platforms },
        });
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBe(platforms.length);
    });

    it('renders the correct colors', () => {
        const wrapper = shallowMount(ConnectedApiIcons, {
            props: { platforms },
        });
        const buttons = wrapper.findAll('button');
        platforms.forEach((platform, index) => {
            expect(buttons[index].attributes('style')).toContain(hexToRgb(platform.color));
        });
    }
    )
    function hexToRgb(hex: string): string {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    it('emits the correct event when a button is clicked', async () => {
        const wrapper = shallowMount(ConnectedApiIcons, {
            props: { platforms },
        });
        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');
        expect(wrapper.emitted().socialClick).toBeTruthy();
        expect(wrapper.emitted().socialClick[0]).toEqual([platforms[0].name]);
    });
});
