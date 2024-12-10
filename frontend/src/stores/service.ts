import { defineStore } from 'pinia';
import { Service } from '@/types/services';
import { Action, Reaction } from '@/types/services';

export const useServiceStore = defineStore('service', {
    state: (): { services: Service[] } => ({
        services: [], // Initialize as an array
    }),
    getters: {
    },
    actions: {
        setNewService(service: Service): void {
            if (this.services.find((s) => s.name === service.name)) return; // Check if the service already exists
            this.services.push(service); // Push the service into the state array
        },
        setServiceAreas(serviceName: string, actions: Action[], reactions: Reaction[]): void {
            const service = this.services.find((service) => service.name === serviceName); // Find the service by name
            if (service) {
                service.actions = actions; // Set the actions
                service.reactions = reactions; // Set the reactions
            }
        }
    },
});
