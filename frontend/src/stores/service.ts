import { defineStore } from 'pinia';
import { Service } from '@/types/services';
import { Category } from '@/types/services';

export const useServiceStore = defineStore('service', {
    state: (): { services: Service[] } => ({
        services: [], // Initialize as an array
    }),
    getters: {
    },
    actions: {
        addService(service: Service): void {
            const storedService: Service | null = this.services.find((s) => s.name === service.name) || null;
            if (!storedService) { // If the service is not found, add it
                this.services.push(service);
                return;
            }
            // Update the service
            storedService.name = service.name;
            storedService.color = service.color;
            storedService.icon = service.icon;
            storedService.reviews = service.reviews;
            storedService.saves = service.saves;
            storedService.categories = service.categories;
        },
    },
});
