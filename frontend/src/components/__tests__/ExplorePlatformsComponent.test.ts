import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ExplorePlatformsComponent from '../ExplorePlatformsComponent.vue';

describe('ExplorePlatformsComponent', () => {
    const platforms = [
        { name: 'Platform 1', color: 'bg-red-500', icon: 'mdi:home' },
        { name: 'Platform 2', color: 'bg-blue-500', icon: 'mdi:account' },
        { name: 'Platform 3', color: 'bg-green-500', icon: 'mdi:settings' },
    ];

    it('renders correctly with given platforms', () => {
        const wrapper = mount(ExplorePlatformsComponent, {
            props: { platforms },
        });

        expect(wrapper.findAll('div[role="button"]').length).toBe(platforms.length);
    });

    it('displays the correct platform names', () => {
        const wrapper = mount(ExplorePlatformsComponent, {
            props: { platforms },
        });

        platforms.forEach((platform, index) => {
            expect(wrapper.findAll('div[role="button"]')[index].text()).toContain(platform.name);
        });
    });

    it('applies the correct classes for platform colors', () => {
        const wrapper = mount(ExplorePlatformsComponent, {
            props: { platforms },
        });

        platforms.forEach((platform, index) => {
            expect(wrapper.findAll('div[role="button"]')[index].classes()).toContain(platform.color);
        });
    });
    it('has the correct aria-label for each platform', () => {
        const wrapper = mount(ExplorePlatformsComponent, {
            props: { platforms },
        });

        platforms.forEach((platform, index) => {
            expect(wrapper.findAll('div[role="button"]')[index].attributes('aria-label')).toBe(`Explore ${platform.name}`);
        });
    });
});