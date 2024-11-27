<template>
  <div class="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Create an account</h2>
    <p class="text-gray-600 mb-6">Fill in the form below to sign up</p>

    <form @submit.prevent="handleRegister">
    <div class="mb-6">
      <label for="name" class="block text-lg font-semibold text-gray-700 mb-2">Name</label>
      <input type="text" id="name" v-model="name" placeholder="Enter your name" 
      class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
    </div>

    <div class="mb-6">
      <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email" 
      class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
    </div>

    <div class="mb-6">
      <label for="password" class="block text-lg font-semibold text-gray-700 mb-2">Password</label>
      <input type="password" id="password" v-model="password" placeholder="Create a password" 
      class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
    </div>

    <div class="mb-6">
      <label for="confirm-password" class="block text-lg font-semibold text-gray-700 mb-2">Confirm Password</label>
      <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="Confirm your password" 
      class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
    </div>

    <button type="submit" class="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
      Sign up
    </button>

    <button type="button" class="w-full mt-4 p-3 bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
      <Icon icon="mdi:github" class="text-white text-2xl mr-2" />
      Sign up with GitHub
    </button>
    </form>

    <p class="text-center text-sm text-gray-600 mt-6">
      Already have an account? <router-link to="/login" class="text-indigo-500 font-semibold hover:underline">Sign in</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match!");
    return;
  }
  console.log(`Name: ${name.value}, Email: ${email.value}, Password: ${password.value}`);
}
</script>

<style scoped>
</style>
