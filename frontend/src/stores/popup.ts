import { defineStore } from 'pinia';
import { Action, Reaction, Category, Service } from '@/types/services';

export const usePopupStore = defineStore('createPopup', {
    state: (): {
        action: {
            card: Action,
            category: Category,
            service: Service,
        } | null,
        reaction: {
            card: Reaction,
            category: Category,
            service: Service,
        } | null,
    } => ({
        action: null,
        reaction: null,
    }),
    getters: {
    },
    actions: {
        setAction(action: Action, category: Category, service: Service): void {
            this.action = {
                card: action,
                category: category,
                service: service,
            };
        },
        setReaction(reaction: Reaction, category: Category, service: Service): void {
            this.reaction = {
                card: reaction,
                category: category,
                service: service,
            };
        },
    },
});
