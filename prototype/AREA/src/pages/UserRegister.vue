<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Create an account</h2>
      <p>Fill in the form below to sign up</p>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Create a password" />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" class="btn primary-btn">Sign up</button>
        <button type="button" class="btn github-btn">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" />
          Sign up with GitHub
        </button>
      </form>
      <p class="signin-text">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
    <div class="register-logo">
      <img src="../assets/area.jpeg" alt="Area Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match!");
    return;
  }
  console.log(`Name: ${name.value}, Email: ${email.value}, Password: ${password.value}`);
}
</script>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  padding: 0 5%;
}

.register-form {
  width: 40%;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.register-form:hover {
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

.signin-text {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 20px;
}

.signin-text a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
}

.signin-text a:hover {
  text-decoration: underline;
}

.register-logo {
  width: 40%;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.register-logo img {
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
</style>
