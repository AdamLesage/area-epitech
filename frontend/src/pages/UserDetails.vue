<template>
  <div class="user-details">
    <div class="profile-card">
      <img src="../assets/area.jpeg" :alt="user.avatar" class="avatar" />
      <h2>{{ user.name }}</h2>
      <p class="Member since">{{ user.created_at }}</p>

      <div class="stats">
        <div>
          <h3>{{ user.action_created }}</h3>
          <p>Number of actions created</p>
        </div>
        <div>
          <h3>{{ user.action_on }}</h3>
          <p>Number of actions on</p>
        </div>
        <div>
          <h3>{{ user.action_off }}</h3>
          <p>Number of actions off</p>
        </div>
      </div>
      <AddConnection/>
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

const showAddConnection = ref(false);
</script>



<style scoped>
.user-details {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 91.2vh;
    background: linear-gradient(135deg, #002855, #ae5201);
    font-family: 'Arial', sans-serif;
    color: #fff;
    margin: 0;
}

.profile-card {
    background: #1b2a41;
    border-radius: 15px;
    padding: 30px;
    width: 50%;
    height: auto;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.avatar {
  width: 35%;
  height: 35%;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #fff;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h2 {
    font-size: 1.8em;
    margin-bottom: 10px;
}


.stats {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}

.stats div {
    text-align: center;
}

.stats h3 {
    font-size: 4.5em;
    margin: 0;
}

.stats p {
    font-size: 1.2em;
    color: #b3d1ff;
}


</style>
