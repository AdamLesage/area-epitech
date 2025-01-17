<template>
    <div class="flex justify-center items-center flex-wrap gap-2">
        <button
            aria-label="connected-api-button"
            v-for="platform in platforms"
            :key="platform.name"
            :style="{ backgroundColor: platform.color }"
            @click.stop="handleClick(platform.name)"
            class="social-btn text-white rounded-full flex items-center justify-center shadow-md transition-transform transform hover:scale-105 w-16 mobile:w-[3rem] h-16 mobile:h-[3rem]">
            <Icon :icon="platform.icon" class="text-xl w-[3.5rem] mobile:w-[2.5rem] h-[3.5rem] mobile:h-[2.5rem] text-white" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Platform {
    name: string;
    color: string;
    icon: string;
}

// List of social platforms to connect to with their respective icons and colors
defineProps<{
    platforms: Platform[] | [];
}>();

const emit = defineEmits(["socialClick"]);

// Function to handle social platform click
function handleClick(platformName: string) {
    emit("socialClick", platformName);
}
</script>
