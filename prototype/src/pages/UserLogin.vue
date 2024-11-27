<template>
  <div class="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4 gap-4">
    <LoginForm />

    <div class="fade-in-anim w-96">
      <img src="../assets/area.jpeg" alt="Area Logo" class="rounded-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<style scoped>
.fade-in-anim {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
