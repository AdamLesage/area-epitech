<template>
  <div class="flex flex-row">
    <div class="flex flex-row h-full w-[20rem]">
      <div class="bg-[#5b9ce742] border-r-2 p-4 h-full w-full border-orange-200 gap-5 flex flex-col flex-start">
        <h1 class="text-indigo-900 text-center w-full text-3xl font-bold">
          Actions
        </h1>
        <div class="flex flex-col px-4 gap-3">
          <div class="text-center items-center bg-gradient-to-br from-[#002855c5] to-[#002855af] rounded-md p-3 flex flex-row justify-between cursor-pointer hover:bg-black"
            v-for="(action, index) in actions" :key="index"
            @click.prevent="activeAction = activeAction == null ? index : null; selectedAction = selectedAction == null ? action : null"
            :style="activeAction == index ? 'background-color: rgb(0, 0, 0);' : ''">
            <p class="text-lg font-bold text-white">{{ action.name }}</p>
            <div class="rounded-full bg-green-500 w-5 h-5" v-if="action.active"></div>
            <div class="rounded-full bg-red-500 w-5 h-5" v-else></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-12 py-10 action-container items-center" v-if="selectedAction">
      <div class="flex flex-row justify-center items-center gap-4">
        <h1 class="text-[#d66b4b8c] text-center text-3xl font-bold">{{ selectedAction.name }}</h1>
        <Icon icon="fluent:edit-12-filled" class="w-8 h-8 text-[#d66b4b8c] cursor-pointer hover:bg-[#d66b4b28] p-1 rounded-lg" />
      </div>
      <div class="bg-gradient-to-br from-[#5b9de769] to-[#ae520125] w-9/12 h-full rounded-md items-center flex flex-col gap-4 pt-12">
        <div class="flex flex-col bg-gradient-to-br from-[#002855] to-[#002855af] w-9/12 p-4 rounded-md pb-6">
          <div class="flex flex-row justify-between w-full">
            <div class="flex flex-col justify-start w-1/12">
              <h2 class="text-white font-bold text-2xl">On</h2>
            </div>
            <div class="flex flex-col justify-start w-full items-center">
              <h2 class="text-white font-bold text-2xl">New Github Issue</h2>
            </div>
            <div class="flex flex-col justify-start w-1/12 items-end">
              <Icon icon="mdi:github" class="w-12 h-12 text-white" />
            </div>
          </div>
          <div class="flex flex-col justify-between w-full mt-4 gap-2 pr-8">
            <div class="flex flex-row justify-end px-8 gap-4 items-center">
              <h2 class="text-white font-semibold text-lg">Github Account:</h2>
              <input type="text" class="w-2/3 px-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700" />
            </div>
            <div class="flex flex-row justify-end px-8 gap-4 items-center">
              <h2 class="text-white font-semibold text-lg">Repository URL:</h2>
              <input type="text" class="w-2/3 px-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#002855] to-[#002855af] flex flex-col w-9/12 p-4 rounded-md pb-6 mt-4">
          <div class="flex flex-row justify-between w-full">
            <div class="flex flex-col justify-start w-1/12">
              <h2 class="text-white font-bold text-2xl">Then</h2>
            </div>
            <div class="flex flex-col justify-start w-full items-center">
              <h2 class="text-white font-bold text-2xl">Create a new Note</h2>
            </div>
            <div class="flex flex-col justify-start w-1/12 items-end">
              <Icon icon="fluent:note-20-filled" class="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div class="flex flex-row justify-end w-3/4 gap-4">
          <button class="bg-[#d45768] hover:bg-[#f74646] text-white font-semibold rounded-lg p-3 px-12" v-if="selectedAction.active" @click.prevent="selectedAction.active = false">Deactivate</button>
          <button class="bg-[#41b651] hover:bg-[#299738] text-white font-semibold rounded-lg p-3 px-12" v-else @click.prevent="selectedAction.active = true">Activate</button>
          <button class="bg-[#d66b4b8c] hover:bg-[#f15811c7] text-white font-semibold rounded-lg p-3 px-12">Delete</button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-12 py-10 action-container items-center w-full" v-else>
      <div class="flex flex-row justify-center items-center gap-4">
        <h1 class="text-[#002855] text-center text-3xl font-bold">No Action Selected</h1>
      </div>
      <div class="flex flex-row gap-8 w-10/12">
        <div v-for="(action, index) in actions" :key="index" class="w-1/4 h-48 bg-gradient-to-br from-[#5b9de769] to-orange-100 rounded-md flex items-center justify-center border-4 border-orange-200 cursor-pointer"
          @click.prevent="activeAction = activeAction == null ? index : null; selectedAction = selectedAction == null ? action : null">
          <p class="text-indigo-900 font-semibold text-center mt-2 text-2xl">{{ action.name }}</p>
        </div>
      </div>
      <!-- List all actions -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

type Action = {
  name: string;
  active: boolean;
};

const actions = ref<Array<Action>>([
  { name: 'Discord Transcript', active: true },
  { name: 'Daily Meteo Recap', active: false },
  { name: 'Github Issues Notes', active: true },
  { name: 'Gmail Transfers', active: false },
]);
const activeAction = ref<number | null>(null);
const selectedAction = ref<Action | null>(null);
</script>

<style scoped>
.action-container {
  width: calc(100% - 20rem);
}
</style>
