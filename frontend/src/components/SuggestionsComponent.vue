<template>
    <section class="bg-indigo-700 rounded-xl shadow-lg p-6" aria-labelledby="suggestions-label">
        <h2 id="suggestions-label" class="text-2xl font-bold tracking-wide mb-6">Suggestions</h2>
        <ul class="space-y-4">
            <li
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                class="bg-indigo-600 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-transform transform hover:scale-105">
                <span class="font-medium">{{ suggestion.content }}</span>
                <button class="bg-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-900">Try</button>
            </li>
        </ul>
    </section>
</template>

<script setup>

// suggestions list
const suggestions = [
    { id: 1, content: '📩 Receive merge info by mail (GitHub)' },
    { id: 2, content: '❤️ Automatically like tweets (Twitter)' },
    { id: 3, content: '📜 Get daily updates on a subject (RSS Feed)' },
];
</script>
