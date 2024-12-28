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
        display: boolean,
        title: string,
        view: 'Extended' | 'Normal' | 'Minimal',
        actionData: Record<string, string>,
        reactionData: Record<string, string>,
    } => ({
        action: null,
        reaction: null,
        display: true,
        title: '',
        view: 'Normal',
        actionData: {},
        reactionData: {},
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
