import axios from 'axios';
import { User } from '@/types/auth';
import { Area } from '@/types/area';

/**
 * Fetches user data using the provided token.
 *
 * @param {string | undefined} token - The user token.
 * @returns {Promise<User | null>} - A promise that resolves when the user data is fetched.
 * 
 * If the user data is fetched successfully, the promise resolves with the user data.
 * 
 * If there is an error while fetching the user data, the promise resolves with null.
 * 
 * @example
 * 
 * const user = await fetchUser(token);
 * console.log(user);
 */
export async function fetchUser(token: string | undefined): Promise<User | null> {
    if (!token)
        return null;

    try {
        const res: { status: number, data: User } =
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.status !== 200)
            throw new Error('Auth token invalid');

        console.log('User fetched successfully:', res.data);

        return res.data;
    } catch (_) {
        console.error('Error while fetching user: Invalid token');
        return null;
    }
}

/**
 * Fetches user areas.
 * 
 * @param {string} token - The user token.
 * @returns {Promise<Area[]>} - A promise that resolves when the areas are fetched.
 * 
 * If the areas are fetched successfully, the promise resolves with the areas.
 * 
 * If there is an error while fetching the areas, the promise resolves with an empty array.
 * 
 * @example
 * 
 * const areas = await fetchUserAreas(token);
 * for (const area of areas) {
 *   console.log(area);
 * }
 */
export async function fetchUserAreas(token: string | undefined): Promise<Area[]> {
    if (!token)
        return [];

    try {
        const res: { status: number, data: Area[] } =
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/areas`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status !== 200)
            throw new Error('Error while fetching user areas');

        console.log('User areas fetched successfully:', res.data);

        return res.data;
    } catch (_) {
        console.error('Error while fetching user areas');
        return [];
    }
}
