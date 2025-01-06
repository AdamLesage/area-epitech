import axios from 'axios';
import { Service } from '@/types/services';

/**
 * Fetches the services and adds them to the services store.
 * 
 * @returns {Promise<Service[]>} A promise that resolves when the services are fetched.
 * If the services are fetched successfully, the promise resolves with the services.
 * 
 * If there is an error while fetching the services, the promise resolves with an empty array.
 * 
 * @example
 * const services = await fetchServices();
 * 
 * for (const service of services) {
 *    console.log(service);
 * }
 */
export async function fetchServices(): Promise<Service[]> {
    try {
        const res: { status: number, data: { services: Service[] }} =
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/services-info.json`);

        if (res.status !== 200) {
            throw new Error('Error while fetching services');
        }

        if (!res.data.services)
            throw new Error('No services found');

        console.log('Services fetched successfully', res.data.services);

        return res.data.services;
    } catch (_) {
        console.error('Error while fetching services');
        return [];
    }
}
