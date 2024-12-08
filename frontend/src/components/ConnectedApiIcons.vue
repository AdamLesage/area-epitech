<template>
    <div class="grid grid-cols-4 gap-6 justify-center">
      <button
        v-for="platform in platforms"
        :key="platform.name"
        :style="{ backgroundColor: platform.color }"
        @click="handleClick(platform.name)"
        class="social-btn text-white p-4 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:scale-110 hover:shadow-lg"
      >
        <Icon :icon="platform.icon" class="text-3xl"></Icon>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  import { Icon } from "@iconify/vue";
  
  interface Platform {
    name: string;
    color: string;
    icon: string;
  }

  defineProps<{
    platforms: Platform[];
  }>();
  
  const emit = defineEmits(["socialClick"]);
  
  function handleClick(platformName: string) {
    emit("socialClick", platformName);
  }
  </script>
  
  <style scoped>
  </style>
