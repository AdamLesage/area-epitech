import { defineStore } from 'pinia';
import { User } from '@/types/auth';
import { Area } from '@/types/area';

export const useUserStore = defineStore('user', {
    state: (): {
        user: User | null,
        areas: Area[],
    } => ({
        user: null, // Initialize as an array
        areas: [],
    }),
    getters: {
    },
    actions: {
        setUser(user: User | null): void {
            this.user = user; // Set the user
        },
        addArea(area: Area): void {
            if (!this.areas.includes(area))
                this.areas.push(area); // Add an area to the list
        }
    },
});
