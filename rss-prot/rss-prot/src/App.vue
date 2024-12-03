<template>
  <v-app>
    <v-container>
      <FeedsManager />
    </v-container>
  </v-app>
</template>

<script>
import FeedsManager from './components/FeedsManager.vue';

export default {
  name: 'App',
  components: {
    FeedsManager,
  },
};
</script>
