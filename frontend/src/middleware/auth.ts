import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export default function auth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const token = Cookies.get('token');

    const store = useUserStore();

    if (!token) {
        Cookies.remove('token');
        store.setUser(null); // Clear the user
        next('/not-authorized'); // Redirect to home
    } else {
        next(); // Proceed to the route
    }
}
