<template>
  <div class="flex justify-center items-center">
    <div class="grid grid-cols-4 gap-2 justify-center">
      <button 
        v-for="platform in platforms"
        :key="platform.name"
        :style="{ backgroundColor: platform.color, width: '50px', height: '50px' }"
        @click="handleClick(platform.name)"
        class="social-btn text-white rounded-full flex items-center justify-center shadow-md transition-transform transform hover:scale-110 hover:shadow-lg"
      >
        <Icon :icon="platform.icon" class="text-xl"></Icon>
      </button>
    </div>
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

// List of social platforms to connect to with their respective icons and colors
defineProps<{
  platforms: Platform[];
}>();

const emit = defineEmits(["socialClick"]);

// Function to handle social platform click
function handleClick(platformName: string) {
  emit("socialClick", platformName);
}
</script>
