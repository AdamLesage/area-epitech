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
      </ul>
    </section>

    <!-- Ajout du bouton -->
    <button @click="createPlaylist">Create Playlist</button>
    <br />
    <button @click="search">Search for id</button>
    <br />
    <button @click="get_playlist">Get Playlist</button>
    <br />
    <br />
    <textarea v-model="inputText" placeholder="Enter some text"></textarea>

    <section v-if="searchResults && searchResults.length" id="search-results">
      <h2>Search Results</h2>
      <ul>
        <li v-for="track in searchResults" :key="track.id">
          <img :src="track.album.images[0]?.url" alt="Album Cover" width="50" height="50" />
          <div>
            <span><strong>{{ track.name }}</strong> by {{ track.artists.map(artist => artist.name).join(', ') }}</span>
            <br />
            <span>URI: <a :href="`https://open.spotify.com/track/${track.id}`" target="_blank">{{ track.uri
                }}</a></span>
            <button @click="addTrackToPlaylist(track.uri)">Add Track to Playlist</button>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="playlists && playlists.length" id="playlists">
      <h2>Your Playlists</h2>
      <ul>
        <li v-for="playlist in playlists" :key="playlist.id">
          <img v-if="playlist.images && playlist.images[0]" :src="playlist.images[0].url" alt="Playlist Cover" width="50" height="50" />
          <div>
            <strong>{{ playlist.name }}</strong> ({{ playlist.tracks.total }} tracks)
            <br />
            <span>URI: <a :href="playlist.external_urls.spotify" target="_blank">{{ playlist.uri }}</a></span>
            <button @click="uri2 = playlist.id">Choose Playlist</button>
          </div>
        </li>
      </ul>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const clientId = "ea8c3996d9524646ab6cf7c7608119ba"; // client ID de l'application Spotify
const profile = ref<any | null>(null);
const accessToken = ref<string | null>(null);
const inputText = ref<string | null>(null);
const searchResults = ref<any | null>(null);
const playlists = ref<any[] | null>(null);
const uri2 = ref<string | null>(null);
// Fonction pour rediriger l'utilisateur vers le flow d'authentification
const redirectToAuthCodeFlow = async (clientId: string) => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/spotify");
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
  params.append("redirect_uri", "http://localhost:5173/spotify");
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
  console.log("Creating playlist..."); // Affiche un message dans la console
  // Envoie la requête POST pour créer une playlist
  const result = await fetch(`https://api.spotify.com/v1/users/${profile.value.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken.value}`, // Utilise l'access token récupéré
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Violator2',
      description: 'My new playlist description',
      public: true
    })
  });

  const newPlaylist = await result.json();
  console.log(newPlaylist); // Affiche la nouvelle playlist dans la console
};

const addTrackToPlaylist = async (uri: string) => {
  if (!profile.value || !accessToken.value) return; // Vérifie si l'utilisateur et le token sont définis

  console.log("Adding track to playlist...");
  console.log(profile.value);
  console.log(accessToken.value);
  console.log(profile.value.id);
  console.log("uri2 =");
  console.log(uri2);

  const result = await fetch(`https://api.spotify.com/v1/playlists/${uri2.value}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [uri]
    })
  });

  const newTrack = await result.json();
  console.log(newTrack);
};

const search = async () => {
  if (!profile.value || !accessToken.value) return;

  console.log("Searching for track...");
  const result = await fetch(`https://api.spotify.com/v1/search?q=${inputText.value}&type=track`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await result.json();
  searchResults.value = data.tracks?.items || []; // Stocke les résultats de recherche dans searchResults
  console.log(searchResults.value); // Affiche les résultats dans la console
};

const get_playlist = async () => {
  if (!profile.value || !accessToken.value) return;

  console.log("Getting playlist...");
  const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await result.json();
  playlists.value = data.items || []; // Stocke les playlists récupérées
  console.log(playlists.value); // Affiche les playlists dans la console
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
