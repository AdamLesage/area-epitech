
<template>
    <aside class="w-full md:w-1/5 bg-indigo-800 text-center p-6" role="complementary" aria-label="Updates">
        <h2 class="text-xl font-bold mb-6">Updates</h2>
        <div class="flex flex-col gap-4">
            <div
                v-for="update in updates"
                :key="update.id"
                class="bg-indigo-700 p-4 rounded-lg shadow-md text-left transition-transform transform hover:scale-105 hover:bg-indigo-600"
                :aria-label="`Update: ${update.content}`">
                {{ update.content }}
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Update {
    id: number;
    content: string;
}

// updates infos
defineProps<{
    updates: Update[];
}>();
</script>

