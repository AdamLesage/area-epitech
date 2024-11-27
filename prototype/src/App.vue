<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <nav v-if="$route.path === '/'" class="bg-gradient-to-br from-indigo-900 to-indigo-800 p-4 shadow-lg h-[5rem] items-center flex flex-row justify-between">
      <div class="flex justify-between items-center w-full">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="./assets/logo.png" alt="Area Logo" class="w-12 h-12 object-cover rounded-full" />
          <span class="text-white font-bold text-xl">Area</span>
        </router-link>

        <div class="flex items-center space-x-10">
          <router-link
            to="/"
            class="text-white text-xl font-medium hover:text-gray-300 transition-colors duration-300"
          >
            Home
          </router-link>
          <router-link
            to="/create-option"
            class="text-white text-xl font-medium hover:text-gray-300 transition-colors duration-300"
          >
            Create Option
          </router-link>
          <router-link to="/user-details" class="flex items-center">
            <Icon icon="fluent:person-16-filled" class="text-white text-3xl hover:text-gray-300 transition-all duration-300" />
          </router-link>
        </div>
      </div>
    </nav>

    <nav v-else class="bg-gradient-to-br from-indigo-900 to-indigo-800 p-4 shadow-lg h-[5rem] items-center flex flex-row justify-between">
      <div class="flex flex-row justify-between items-center w-full">
        <router-link
          to="/"
          class="text-white text-xl font-medium hover:text-gray-300 transition-colors duration-300"
        >
          Home
        </router-link>
        <div class="flex space-x-8">
          <router-link
            to="/login"
            class="text-white text-xl font-medium hover:text-gray-300 transition-colors duration-300"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="text-white text-xl font-medium hover:text-gray-300 transition-colors duration-300"
          >
            Register
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="slot">
      <router-view class="h-full"/>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.slot {
  height: calc(100vh - 5rem);
}
</style>
