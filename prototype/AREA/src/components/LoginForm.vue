<template>
  <div class="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
    <p class="text-gray-600 mb-6">Please sign in below</p>

    <form @submit.prevent="handleLogin">
      <div class="mb-6">
        <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-lg font-semibold text-gray-700 mb-2">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
      </div>

      <div class="flex justify-between items-center mb-6">
        <label class="flex items-center text-sm text-gray-700">
          <input type="checkbox" v-model="rememberMe" class="mr-2" /> Remember me
        </label>
        <a href="#" class="text-sm text-indigo-500 hover:underline">Forgot password?</a>
      </div>

      <button type="submit"
        class="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
        Sign in
      </button>

      <button type="button" class="w-full mt-4 p-3 bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
        <Icon icon="mdi:github" class="text-white text-2xl mr-2" />
        Sign in with GitHub
      </button>
    </form>

    <p class="text-center text-sm text-gray-600 mt-6">
      Don't have an account? <router-link to="/register" class="text-indigo-500 font-semibold hover:underline">Sign up</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);

const handleLogin = () => {
  console.log(`Email: ${email.value}, Password: ${password.value}`);
};
</script>

<style scoped>
</style>
