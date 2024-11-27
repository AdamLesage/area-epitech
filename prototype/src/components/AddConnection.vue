<template>
    <div class="social-buttons grid grid-cols-4 gap-4 p-4">
      <button
        @click="handleSocialClick('Facebook')"
        class="social-btn bg-blue-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-700"
      >
        <Icon icon="mdi:facebook" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Twitter')"
        class="social-btn bg-sky-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-sky-600"
      >
        <Icon icon="mdi:twitter" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Google')"
        class="social-btn bg-red-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-700"
      >
        <Icon icon="mdi:google" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Instagram')"
        class="social-btn bg-purple-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-purple-700"
      >
        <Icon icon="mdi:instagram" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('LinkedIn')"
        class="social-btn bg-blue-700 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-800"
      >
        <Icon icon="mdi:linkedin" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Pinterest')"
        class="social-btn bg-red-700 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-800"
      >
        <Icon icon="mdi:pinterest" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('VK')"
        class="social-btn bg-blue-400 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-500"
      >
        <Icon icon="mdi:vk" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Stack Overflow')"
        class="social-btn bg-orange-400 text-white p-2 rounded-full flex items-center justify-center hover:bg-orange-500"
      >
        <Icon icon="mdi:stack-overflow" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('YouTube')"
        class="social-btn bg-red-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-600"
      >
        <Icon icon="mdi:youtube" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Slack')"
        class="social-btn bg-purple-800 text-white p-2 rounded-full flex items-center justify-center hover:bg-purple-900"
      >
        <Icon icon="mdi:slack" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('GitHub')"
        class="social-btn bg-gray-800 text-white p-2 rounded-full flex items-center justify-center hover:bg-gray-900"
      >
        <Icon icon="mdi:github" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Dribbble')"
        class="social-btn bg-pink-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-pink-600"
      >
        <Icon icon="mdi:dribbble" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('Reddit')"
        class="social-btn bg-orange-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-orange-700"
      >
        <Icon icon="mdi:reddit" class="text-2xl"></Icon>
      </button>
      <button
        @click="handleSocialClick('WhatsApp')"
        class="social-btn bg-green-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-green-600"
      >
        <Icon icon="mdi:whatsapp" class="text-2xl"></Icon>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Icon } from '@iconify/vue';
  
  function handleSocialClick(platform: string) {
    console.log(`Connect with ${platform}`);
  }
  </script>
  
  <style scoped>
  .social-buttons {
    max-width: 500px;
    margin: auto;
  }
  </style>
  