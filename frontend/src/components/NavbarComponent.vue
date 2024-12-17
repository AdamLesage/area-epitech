<template>
    <header class="flex flex-col md:flex-row items-center justify-between bg-indigo-900 py-4 px-8 shadow-lg">
        <!-- Titre principal -->
        <h1 
            class="text-3xl font-bold tracking-wide mb-4 md:mb-0 cursor-pointer text-white" 
            @click="navigateTo('/')"
        >
            AREA
        </h1>

        <!-- Bouton Menu  pour Mobile -->
        <button 
            @click="toggleMenu" 
            class="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white p-2 rounded" 
            :aria-expanded="isMenuOpen" 
            aria-label="Toggle Navigation Menu"
        >
            <Icon :icon="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="text-3xl" />
        </button>

        <!-- Navigation -->
        <nav 
            :class="{'hidden': !isMenuOpen, 'flex': isMenuOpen}" 
            class="flex-col md:flex md:flex-row gap-4 md:gap-6 w-full md:w-auto"
            aria-label="Primary Navigation"
        >
            <button
                v-for="link in headerLinks"
                :key="link.name"
                @click="navigateTo(link.route)"
                class="flex items-center gap-2 text-lg font-medium bg-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105 text-white focus:outline-none focus:ring-2 focus:ring-white"
                :aria-label="`Navigate to ${link.name}`"
            >
                <Icon :icon="link.icon" class="text-2xl" aria-hidden="true" />
                {{ link.name }}
            </button>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// Contrôle de l'état du menu burger
const isMenuOpen = ref(false);

// Fonction pour afficher/masquer le menu
function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
}

// Fonction pour naviguer vers une route spécifique
function navigateTo(route: string) {
    console.log(`Navigating to ${route}`);
}

// Liste des liens du header
const headerLinks = [
    { name: 'Explore', icon: 'mdi:compass-outline', route: '' },
    { name: 'My Areas', icon: 'mdi:folder-outline', route: '/areas' },
    { name: 'Updates', icon: 'mdi:bell-outline', route: '' },
    { name: 'Profile', icon: 'mdi:account-outline', route: '/userinfo' },
];
</script>

<style scoped>
/* Ajout d'une animation pour l'affichage du menu */
nav {
    transition: all 0.3s ease-in-out;
}
</style>
