<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-orange-600 font-sans text-white">
    <div class="bg-gray-800 rounded-lg p-8 w-1/2 text-center shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
      <img src="../assets/area.jpeg" :alt="user.avatar" class="w-1/3 h-1/3 rounded-full mb-5 border-4 border-white mx-auto" />
      <h2 class="text-2xl mb-2">{{ user.name }}</h2>
      <p class="text-lg mb-5">{{ user.created_at }}</p>

      <div class="flex justify-between my-5">
        <div class="text-center">
          <h3 class="text-5xl">{{ user.action_created }}</h3>
          <p class="text-xl text-blue-200">Number of actions created</p>
        </div>
        <div class="text-center">
          <h3 class="text-5xl">{{ user.action_on }}</h3>
          <p class="text-xl text-blue-200">Number of actions on</p>
        </div>
        <div class="text-center">
          <h3 class="text-5xl">{{ user.action_off }}</h3>
          <p class="text-xl text-blue-200">Number of actions off</p>
        </div>
      </div>
      <AddConnection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddConnection from '../components/AddConnection.vue';

const user = ref({
  name: 'Romain Chavalier',
  location: 'New York, United States',
  avatar: '../assets/area.jpeg',
  created_at: '24 June 2021',
  action_created: 65,
  action_on: 43,
  action_off: 21,
});
</script>

<style scoped>
</style>