<template>
  <div>
    <h1>Display your Spotify profile data</h1>
    <section v-if="profile" id="profile">
      <h2>Logged in as <span>{{ profile.display_name }}</span></h2>
      <span id="avatar">
        <img v-if="profile.images[0]" :src="profile.images[0].url" alt="Profile Image" width="200" height="200" />
      </span>
      <ul>
        <li>User ID: <span>{{ profile.id }}</span></li>
        <li>Email: <span>{{ profile.email }}</span></li>
        <li>Spotify URI: <a :href="profile.external_urls.spotify">{{ profile.uri }}</a></li>
        <li>Link: <a :href="profile.href">{{ profile.href }}</a></li>
        <li>Profile Image: <span>{{ profile.images[0]?.url || '(no profile image)' }}</span></li>
      </ul>
    </section>

    <!-- Ajout du bouton -->
    <button @click="createPlaylist">Create Playlist</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const clientId = "ea8c3996d9524646ab6cf7c7608119ba"; // Remplace par ton client ID
const profile = ref<any | null>(null);
const accessToken = ref<string | null>(null); // Déclare un accessToken pour le stocker une fois récupéré

// Fonction pour rediriger l'utilisateur vers le flow d'authentification
const redirectToAuthCodeFlow = async (clientId: string) => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Génération du code verifier pour l'authentification
function generateCodeVerifier(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Génération du code challenge basé sur le code verifier
const generateCodeChallenge = async (codeVerifier: string) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Récupération du token d'accès via l'API Spotify
const getAccessToken = async (clientId: string, code: string): Promise<string> => {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
};

// Fonction pour récupérer les données du profil de l'utilisateur
const fetchProfile = async (token: string) => {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
};

// Effectuer les actions après le montage du composant
onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    accessToken.value = await getAccessToken(clientId, code); // Récupère et stocke le token
    profile.value = await fetchProfile(accessToken.value); // Récupère les informations de profil
  }
});

// Fonction pour créer une playlist
const createPlaylist = async () => {
  if (!profile.value || !accessToken.value) return; // Vérifie si l'utilisateur et le token sont définis

  console.log("Creating playlist: ");
  console.log(profile.value); // Affiche les informations du profil dans la console
  console.log(accessToken.value); // Affiche le token dans la console
  console.log(profile.value.id); // Affiche l'ID de l'utilisateur dans la console
  // Envoie la requête POST pour créer une playlist
  const result = await fetch(`https://api.spotify.com/v1/users/${profile.value.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken.value}`, // Utilise l'access token récupéré
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'My new playlist',
      description: 'My new playlist description',
      public: false
    })
  });

  const newPlaylist = await result.json();
  console.log(newPlaylist); // Affiche la nouvelle playlist dans la console
};

</script>

<style scoped>
h1 {
  font-size: 24px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

img {
  border-radius: 50%;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1ed760;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
