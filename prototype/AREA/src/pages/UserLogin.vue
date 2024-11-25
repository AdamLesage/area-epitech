<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Welcome back</h2>
      <p>Please sign in below</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" />
        </div>
        <div class="form-options">
          <label>
            <input type="checkbox" v-model="rememberMe" /> Remember me
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>
        <button type="submit" class="btn primary-btn">Sign in</button>
        <button type="button" class="btn github-btn">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" />
          Sign in with GitHub
        </button>
      </form>
      <p class="signup-text">
        Don’t have an account? <a href="/register">Sign up</a>
      </p>
    </div>
    <div class="login-logo">
      <img src="../assets/area.jpeg" alt="Area Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = () => {
  console.log(`Email: ${email.value}, Password: ${password.value}`);
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  padding: 0 5%;
}

.login-form {
  width: 40%;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.login-form:hover {
  transform: translateY(-5px);
  box-shadow: 0px 12px 40px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 16px;
  color: #555;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #444;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0px 0px 5px rgba(99, 102, 241, 0.4);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-password {
  font-size: 14px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.3s, transform 0.2s;
}

.primary-btn {
  background-color: #6366f1;
  color: white;
}

.primary-btn:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
}

.github-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #24292e;
  color: white;
}

.github-btn img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.github-btn:hover {
  background-color: #1b1f23;
  transform: translateY(-2px);
}

.signup-text {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 20px;
}

.signup-text a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
}

.signup-text a:hover {
  text-decoration: underline;
}

.login-logo {
  width: 40%;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.login-logo img {
  max-width: 80%;
  height: auto;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.2));
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

body {
  background-color: rebeccapurple;
  margin: 0;
  padding: 0;
}
</style>
