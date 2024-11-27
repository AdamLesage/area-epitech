<template>
  <div class="create-option">
    <h1>Create Option</h1>
    <div class="button-group">
      <MDBBtn
        v-for="platform in platforms"
        :key="platform.name"
        :style="{ backgroundColor: platform.color, fontSize: '1.5rem', padding: '1rem 2rem' }"
        @click="selectPlatform(platform.name)"
        class="platform-btn"
      >
        <MDBIcon :iconStyle="platform.iconStyle" :icon="platform.icon" />
      </MDBBtn>
    </div>

    <div v-if="selectedPlatform" class="dynamic-form">
      <h2>Create an action for {{ selectedPlatform }}</h2>
      <form @submit.prevent="submitForm">
        <div v-if="selectedPlatform === 'Reddit'" class="form-group">
          <label for="subreddit">Subreddit Name</label>
          <input
            type="text"
            id="subreddit"
            v-model="formData.subreddit"
            placeholder="Enter subreddit name"
            required
          />
        </div>
        <div v-if="selectedPlatform === 'Twitter'" class="form-group">
          <label for="tweet">Tweet Content</label>
          <input
            type="text"
            id="tweet"
            v-model="formData.tweet"
            placeholder="Enter your tweet content"
            required
          />
        </div>
        <div class="form-group">
          <label>Action Type</label>
          <div class="action-type-selector">
            <MDBBtn
              v-for="action in getActionsForPlatform(selectedPlatform)"
              :key="action"
              @click="selectActionType(action)"
              :class="{'selected': formData.actionType === action}"
              class="action-btn"
            >
              {{ action }}
            </MDBBtn>
          </div>
        </div>
      </form>

      <h2>Create a reaction</h2>
      <form @submit.prevent="submitReactionForm">
        <div class="form-group">
          <label>Reaction Platform</label>
          <div class="reaction-platform-selector">
            <MDBBtn
              v-for="platform in platforms"
              :key="platform.name"
              @click="selectReactionPlatform(platform.name)"
              :class="{'selected': formData.reactionPlatform === platform.name}"
              class="reaction-btn"
            >
              <MDBIcon :iconStyle="platform.iconStyle" :icon="platform.icon" />
            </MDBBtn>
          </div>
        </div>

        <div class="form-group">
          <label>Reaction Type</label>
          <div class="reaction-type-selector">
            <MDBBtn
              v-for="reaction in getReactionsForPlatform(formData.reactionPlatform)"
              :key="reaction"
              @click="selectReactionType(reaction)"
              :class="{'selected': formData.reactionType === reaction}"
              class="reaction-btn"
            >
              {{ reaction }}
            </MDBBtn>
          </div>
        </div>

        <button type="submit" class="submit-btn">Create ActionReaction</button>
      </form>
    </div>
  </div>
</template>

  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { MDBBtn, MDBIcon } from 'mdb-vue-ui-kit';
  
  const platforms = ref([
    { name: 'Facebook', icon: 'facebook-f', iconStyle: 'fab', color: 'rgb(59, 89, 152)' },
    { name: 'Twitter', icon: 'twitter', iconStyle: 'fab', color: 'rgb(85, 172, 238)' },
    { name: 'Reddit', icon: 'reddit-alien', iconStyle: 'fab', color: 'rgb(255, 69, 0)' },
    { name: 'Instagram', icon: 'instagram', iconStyle: 'fab', color: 'rgb(172, 43, 172)' },
    { name: 'LinkedIn', icon: 'linkedin-in', iconStyle: 'fab', color: 'rgb(0, 130, 202)' },
    { name: 'YouTube', icon: 'youtube', iconStyle: 'fab', color: 'rgb(237, 48, 47)' },
    { name: 'WhatsApp', icon: 'whatsapp', iconStyle: 'fab', color: 'rgb(37, 211, 102)' },
    { name: 'Google', icon: 'google', iconStyle: 'fab', color: 'rgb(221, 75, 57)' },
    { name: 'Pinterest', icon: 'pinterest', iconStyle: 'fab', color: 'rgb(198, 17, 24)' },
    { name: 'VK', icon: 'vk', iconStyle: 'fab', color: 'rgb(76, 117, 163)' },
    { name: 'Stack Overflow', icon: 'stack-overflow', iconStyle: 'fab', color: 'rgb(255, 172, 68)' },
    { name: 'Slack', icon: 'slack-hash', iconStyle: 'fab', color: 'rgb(72, 20, 73)' },
    { name: 'GitHub', icon: 'github', iconStyle: 'fab', color: 'rgb(51, 51, 51)' },
    { name: 'Dribbble', icon: 'dribbble', iconStyle: 'fab', color: 'rgb(236, 74, 137)' },
  ]);
  
  const selectedPlatform = ref<string | null>(null);
  const formData = ref({
    subreddit: '',
    tweet: '',
    actionType: '',
    reactionPlatform: '',
    reactionType: '',
    value: '',
  });
  
  function selectPlatform(platformName: string) {
    selectedPlatform.value = platformName;
    formData.value = { subreddit: '', tweet: '', actionType: '', reactionPlatform: '', reactionType: '', value: '' };
  }
  
  function selectActionType(action: string) {
    formData.value.actionType = action;
  }
  
  function selectReactionPlatform(platformName: string) {
    formData.value.reactionPlatform = platformName;
    formData.value.reactionType = '';
  }
  
  function selectReactionType(reaction: string) {
    formData.value.reactionType = reaction;
  }
  
  function submitForm() {
    console.log(`Creating action for ${selectedPlatform.value}:`, formData.value);
    alert(`Action created for ${selectedPlatform.value}!`);
    selectedPlatform.value = null;
  }
  
  function submitReactionForm() {
    console.log(`Creating reaction for ${formData.value.reactionPlatform}:`, formData.value);
    alert(`ActionReaction created for ${formData.value.reactionPlatform}!`);
    selectedPlatform.value = null;
  }
  
  function getActionsForPlatform(platform: string) {
    switch (platform) {
      case 'Facebook':
        return ['Like', 'Comment', 'Share'];
      case 'Twitter':
        return ['Tweet', 'Retweet', 'Like'];
      case 'Reddit':
        return ['Post', 'Comment', 'Upvote'];
      case 'Instagram':
        return ['Post', 'Comment', 'Like'];
      case 'LinkedIn':
        return ['Post', 'Comment', 'Like'];
      case 'YouTube':
        return ['Subscribe', 'Comment', 'Like'];
      case 'WhatsApp':
        return ['Message', 'Call', 'Video Call'];
      case 'Google':
        return ['Search', 'Review', 'Comment'];
      case 'Pinterest':
        return ['Pin', 'Comment', 'Like'];
      case 'VK':
        return ['Post', 'Comment', 'Like'];
      case 'Stack Overflow':
        return ['Ask Question', 'Answer Question', 'Comment'];
      case 'Slack':
        return ['Message', 'Call', 'Video Call'];
      case 'GitHub':
        return ['Create Repository', 'Issue', 'Pull Request'];
      case 'Dribbble':
        return ['Post', 'Comment', 'Like'];
      default:
        return [];
    }
  }
  
  function getReactionsForPlatform(platform: string) {
    switch (platform) {
      case 'Facebook':
        return ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];
      case 'Twitter':
        return ['Like', 'Retweet', 'Reply'];
      case 'Reddit':
        return ['Upvote', 'Downvote', 'Comment'];
      case 'Instagram':
        return ['Like', 'Comment'];
      case 'LinkedIn':
        return ['Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious'];
      case 'YouTube':
        return ['Like', 'Dislike', 'Comment'];
      case 'WhatsApp':
        return ['Like', 'Love', 'Laugh', 'Surprised', 'Sad', 'Angry'];
      case 'Google':
        return ['Like', 'Dislike', 'Comment'];
      case 'Pinterest':
        return ['Like', 'Comment'];
      case 'VK':
        return ['Like', 'Comment'];
      case 'Stack Overflow':
        return ['Upvote', 'Downvote', 'Comment'];
      case 'Slack':
        return ['Like', 'Laugh', 'Surprised', 'Sad', 'Angry'];
      case 'GitHub':
        return ['Star', 'Fork', 'Watch'];
      case 'Dribbble':
        return ['Like', 'Comment'];
      default:
        return [];
    }
  }
  </script>
  <style scoped>
.create-option {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #ffffff;
  background: linear-gradient(135deg, #001f3f, #003366);
  min-height: 100vh;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #ff9f43;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.platform-btn {
  border: none;
  border-radius: 50px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.platform-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.dynamic-form {
  background-color: #00264d;
  color: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: inline-block;
  text-align: left;
  margin-top: 20px;
}

.dynamic-form h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #ff9f43;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  color: #ffcc80;
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
}

.action-type-selector, 
.reaction-platform-selector, 
.reaction-type-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.action-btn, 
.reaction-btn {
  background-color: #0056b3;
  border-radius: 10px;
  color: #ffffff;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
}

.action-btn:hover, 
.reaction-btn:hover {
  background-color: #ff851b;
  transform: scale(1.1);
}

button.submit-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: #ff9f43;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button.submit-btn:hover {
  background-color: #e67e22;
  transform: translateY(-3px);
}
</style>
