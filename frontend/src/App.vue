<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
nav {
  display: flex;
  justify-content: center;
  background-color: #333;
  padding: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

nav a {
  margin: 0 15px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: #ff6347;
  transform: scale(1.1);
}

nav a:active {
  color: #ff4500;
}
</style>
