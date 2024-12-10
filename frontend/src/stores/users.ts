import { defineStore } from 'pinia';
import { User } from '@/types/auth';

export const useUserStore = defineStore('user', {
    state: (): { user: User | null } => ({
        user: null, // Initialize as an array
    }),
    getters: {
    },
    actions: {
        setUser(user: User): void {
            this.user = user; // Set the user
        },
        clearUser(): void {
            this.user = null; // Clear the user
        },
    },
});
