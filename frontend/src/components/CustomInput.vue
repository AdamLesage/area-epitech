<template>
    <div class="w-full">
        <input v-if="isSupported && isDefaultInput" :type="props.type" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full"
            @change="handleChange"/>
        <textarea v-if="type === 'textarea'" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] max-h-36 min-h-12 w-full"
            @change="handleChange"></textarea>
        <div v-if="!isSupported">"{{ props.type }}" type is not yet supported by CustomInput component</div>
        <div v-if="type === 'SpotifyPlaylist'" class="text-[#333] rounded-lg max-w-xl mx-auto w-full">
            <div class="flex gap-4 items-center" v-if="step != 'allDone'">
                <h2 class="text-lg font-bold text-center">Choose Playlist</h2>
                <Icon v-if="required" icon="mdi:required" class="text-red-500" />
            </div>

            <!-- Select Playlist View -->
            <div v-if="step2 === 'selectPlaylist'" class="flex flex-col gap-2 w-full justify-center">
                <h3 class="text-md font-semibold my-2 ml-2">1. Select a Playlist</h3>
                <div class="flex flex-wrap gap-2 w-full justify-center">
                    <div
                        v-for="playlist in spotifyPlaylists"
                        :key="playlist.id"
                        class="bg-[#24292e] p-2 rounded-md flex items-center gap-2 hover:bg-[#374048] w-full transition justify-start hover:cursor-pointer"
                        @click="selectPlaylist(playlist)" >
                        <img :src="playlist.images[0].url" alt="Playlist Cover" class="w-8 h-8 rounded-md" />
                        <div class="flex flex-col">
                            <a :href="playlist.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{playlist.name}}</a>
                            <h4 class="text-white text-xs">{{ playlist.tracks.total }} tracks</h4>
                        </div>
                    </div>
                    <div v-if="spotifyPlaylists.length === 0" class="text-[#777] text-sm text-center"><i>No playlist found.<br/>Verify you are correctly linked to Spotify</i></div>
                </div>
            </div>
            <div v-if="step2 === 'allDone' && selectedPlaylist" class="flex flex-col gap-2 mt-2">
                <div class="bg-[#24292e] p-2 rounded-md flex items-center gap-2 w-full justify-start">
                    <img :src="selectedPlaylist.images[0].url" alt="Playlist Cover" class="w-8 h-8 rounded-md" />
                    <div class="flex flex-col">
                        <a :href="selectedPlaylist.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{selectedPlaylist.name}}</a>
                        <h4 class="text-white text-xs">{{ selectedPlaylist.tracks.total }} tracks</h4>
                    </div>
                    <button class="rounded-md text-sm text-[#fff] underline transition"
                        @click="backToPlaylistSelection">
                        {{ action ? 'Connect' : 'Choose'}} Another Playlist
                        </button>
                </div>
            </div>
        </div>
        <div v-if="type === 'SpotifyMusic'" class="text-[#333] rounded-lg max-w-xl mx-auto w-full">
            <div class="flex gap-4 items-center" v-if="step != 'allDone'">
                <h2 class="text-lg font-bold text-center">Choose Music</h2>
                <Icon v-if="required" icon="mdi:required" class="text-red-500" />
            </div>

            <!-- Select Music View -->
            <div v-if="step3 === 'selectMusic'" class="flex flex-col gap-2 w-full justify-center">
                <h3 class="text-md font-semibold my-2 ml-2">1. Select a Music</h3>
                <div class="flex flex-wrap gap-2 w-full justify-center">
                    <input
                        type="text"
                        v-model="search"
                        placeholder="Search for music"
                        class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full"
                    />
                    <button
                        class="p-2 w-full bg-[#1db954] rounded-md text-sm text-white hover:[#38e073] transition"
                        @click="searchmusic">
                        Search
                    </button>
                    <div
                        v-for="music in spotifyMusics"
                        :key="music.id"
                        class="bg-[#24292e] p-2 rounded-md flex items-center gap-2 hover:bg-[#374048] w-full transition justify-start hover:cursor-pointer"
                        @click="selectMusic(music)" >
                        <img :src="music.images[0].url" alt="Music Cover" class="w-8 h-8 rounded-md" />
                        <div class="flex flex-col">
                            <a :href="music.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{music.name}}</a>
                            <h4 class="text-white text-xs">
                                <span v-for="(artist, index) in music.artists" :key="artist.name">
                                    {{ artist.name }}<span v-if="index < music.artists.length - 1">, </span>
                                </span>
                            </h4>
                        </div>
                    </div>
                    <div v-if="spotifyMusics.length === 0" class="text-[#777] text-sm text-center"><i>No music found.<br/>Verify you are correctly linked to Spotify</i></div>
                </div>
            </div>
            <div v-if="step3 === 'allDone' && selectedMusic" class="flex flex-col gap-2 mt-2">
                <div class="bg-[#24292e] p-2 rounded-md flex items-center gap-2 w-full justify-start">
                    <img :src="selectedMusic.images[0].url" alt="Playlist Cover" class="w-8 h-8 rounded-md" />
                    <div class="flex flex-col">
                        <a :href="selectedMusic.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{selectedMusic.name}}</a>
                        <h4 class="text-white text-xs">
                            <span v-for="(artist, index) in selectedMusic.artists" :key="artist.name">
                                {{ artist.name }}<span v-if="index < selectedMusic.artists.length - 1">, </span>
                            </span>
                        </h4>
                    </div>
                    <button class="rounded-md text-sm text-[#fff] underline transition"
                        @click="backToMusicSelection">
                        {{ action ? 'Connect' : 'Choose'}} Another Music
                        </button>
                </div>
            </div>
        </div>
        <div v-if="type === 'GithubRepository'" class="text-[#333] rounded-lg max-w-xl mx-auto w-full">
            <div class="flex gap-4 items-center" v-if="step != 'allDone'">
                <h2 class="text-lg font-bold text-center">Connect your GitHub Repository</h2>
                <Icon v-if="required" icon="mdi:required" class="text-red-500" />
            </div>

            <!-- Select User View -->
            <div v-if="step === 'selectUser'" class="flex flex-col gap-2 w-full justify-center">
                <h3 class="text-md font-semibold my-2 ml-2">1. Select a User</h3>
                <div class="flex flex-wrap gap-2 w-full justify-center">
                    <div
                        v-for="user in githubUsers"
                        :key="user.id"
                        class="bg-[#24292e] p-2 rounded-md flex items-center gap-2 hover:bg-[#374048] transition w-32 h-16 justify-center hover:cursor-pointer"
                        @click="selectUser(user)" >
                        <h4 class="text-white text-sm">{{ user.name }}</h4>
                    </div>
                    <div v-if="githubUsers.length === 0" class="text-[#777] text-sm text-center"><i>No users found.<br/>Verify you are correctly linked to Github</i></div>
                </div>
            </div>

            <!-- Select Repository View -->
            <div v-if="step === 'selectRepo'" class="flex flex-col gap-2 rounded-md">
                <h3 class="text-md font-semibold ml-2 my-2">2. Select a Repository</h3>
                <div
                    v-for="repo in filteredRepositories"
                    :key="repo.id"
                    class="bg-[#24292e] p-2 pl-3 flex rounded-md justify-between items-center transition hover:cursor-pointer"
                    @click="selectRepository(repo)">
                    <div class="flex gap-2 items-center">
                        <Icon icon="mdi:github" class="text-white" />
                        <a :href="repo.url" target="_blank" class="text-white hover:text-blue-500 hover:underline">
                            {{ repo.owner + '/' + repo.name }}
                        </a>
                    </div>
                    <span
                    class="text-xs border rounded-full px-2 py-1 capitalize"
                        :class="repo.visibility == 'private' ? 'border-red-400 text-red-500' : 'border-green-400 text-green-500'">
                        {{ repo.visibility }}
                    </span>
                </div>
                <button
                    class="p-2 w-full mt-2 bg-blue-500 rounded-md text-sm text-white hover:bg-blue-600 transition"
                    @click="backToUserSelection">
                    Back to User Selection
                </button>
            </div>

            <div v-if="step === 'addWebhook' && action && selectedRepository" class="flex flex-col gap-2">
                <h3 class="text-md font-semibold ml-2 mt-2">3. Add Webhook</h3>
                <h4 class="text-[#333] ml-2">This process is automated, please wait</h4>
            </div>

            <div v-if="step === 'allDone' && selectedRepository" class="flex flex-col gap-2 mt-2">
                <div class="bg-[#24292e] p-2 pl-3 flex rounded-md justify-between items-center transition">
                    <div class="flex gap-2 items-center">
                        <Icon icon="mdi:github" class="text-white" />
                        <a :href="selectedRepository.url" target="_blank" class="text-white hover:text-blue-500 hover:underline">
                            {{ selectedRepository.owner + '/' + selectedRepository.name }}
                        </a>
                    </div>
                    <div class="flex gap-2 items-center">
                        <span
                            class="text-xs border rounded-full px-2 py-1 capitalize"
                            :class="selectedRepository.visibility == 'private' ? 'border-red-400 text-red-500' : 'border-green-400 text-green-500'">
                            {{ selectedRepository.visibility }}
                        </span>
                        <span
                            class="text-xs border rounded-full px-2 py-1 capitalize border-blue-400 text-blue-500"
                            v-if="action">
                            Connected
                        </span>
                    </div>
                </div>
                <div class="flex justify-between items-center px-2">
                    <div class="flex gap-2 items-center">
                        <h3 class="text-md font-semibold">All Done {{ action ? '(Connected)' : ''}}</h3>
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                    </div>
                    <button class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                        @click="backToUserSelection">
                        {{ action ? 'Connect' : 'Choose'}} Another Repository
                    </button>
                </div>
            </div>

            <p v-if="error" class="text-red-500 text-sm ml-2">{{ error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { OptionType } from '@/types/services';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue';
import axios from 'axios';

const userStore = useUserStore();

interface Repository {
    id: number;
    name: string;
    owner: string;
    visibility: string;
    url: string;
}

interface Playlist {
    id: string;
    name: string;
    uri: string;
    external_urls: {
        spotify: string;
    };
    images: {
        url: string;
    }[];
    tracks: {
        total: number;
    };
}

interface Music {
    id: string;
    name: string;
    uri: string;
    external_urls: {
        spotify: string;
    };
    images: {
        url: string;
    }[];
    artists: {
        name: string;
    }[];
}

interface User {
    id: number;
    name: string;
}

interface Hook {
    id: number;
    name: string;
    active: boolean;
    events: string[];
    config: {
        url: string;
        content_type: string;
    };
}

const props = defineProps<{
    name: string;
    type: OptionType;
    value: string | undefined;
    required: boolean;
    action: boolean;
}>();

const value = ref<string>(props.value == undefined ? '' : props.value);

watch(() => props.value, (newValue) => {
    value.value = newValue == undefined ? '' : newValue;
});

const emit = defineEmits(['change']);

const error = ref<string | null>(null);
const step = ref<'selectUser' | 'selectRepo' | 'addWebhook' | 'allDone'>('selectUser');
const step2 = ref<'selectPlaylist' | 'allDone'>('selectPlaylist');
const step3 = ref<'selectMusic' | 'allDone'>('selectMusic');
const selectedUser = ref<User | null>(null);
const selectedRepository = ref<Repository | null>(null);
const selectedPlaylist = ref<Playlist | null>(null);
const selectedMusic = ref<Music | null>(null);
const filteredRepositories = computed(() =>
    githubRepositories.value.filter(
        (repo) =>
        repo.owner === selectedUser.value?.name
    )
);

function selectUser(user: User) {
    selectedUser.value = user;
    step.value = 'selectRepo';
};

function selectPlaylist(playlist: Playlist) {
    selectedPlaylist.value = playlist;
    step2.value = 'allDone';
    emit('change', playlist.uri);
};

function selectMusic(music: Music) {
    selectedMusic.value = music;
    step3.value = 'allDone';
    emit('change', music.id);
};

async function selectRepository(repo: Repository) {
    selectedRepository.value = repo;

    if (props.action)
        step.value = 'addWebhook';
    else {
        step.value = 'allDone';
        emit('change', repo.owner + '/' + repo.name);
        return;
    }

    // Check if the repository has a webhook with the backend url as payload url
    // If not, create a webhook
    try {
        const user = userStore.user;
        if (!user) return;

        const githubLinkedAccount = user.linkedAccounts.find(
            (account) => account.serviceName === 'github'
        );
        if (!githubLinkedAccount) return;

        const accessToken = githubLinkedAccount.authToken;
        if (!accessToken) return;

        const res: { status: number, data: Hook[] } = await axios.get(`https://api.github.com/repos/${repo.owner}/${repo.name}/hooks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Webhook created:', res);

        const hooks = res.data;
        const connectedHook = hooks.find((hook) => hook.config.url === import.meta.env.VITE_DEPLOYED_URL + '/github/webhook/');
        
        console.log('Connected Hook:', connectedHook);

        if (connectedHook) {
            if (!connectedHook.active) {
                // Activate the webhook
                const res: { status: number, data: Hook } = await axios.patch(`https://api.github.com/repos/${repo.owner}/${repo.name}/hooks/${connectedHook.id}`, {
                    active: true,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.status !== 200) {
                    console.error('Failed to activate webhook:', res.data);
                    throw new Error('Failed to activate webhook');
                }

                step.value = 'allDone';
                emit('change', repo.owner + '/' + repo.name);
                return;
            }

            step.value = 'allDone';
            emit('change', repo.owner + '/' + repo.name);
            return;
        }

        // Create a new webhook
        const res2: { status: number, data: Hook } = await axios.post(`https://api.github.com/repos/${repo.owner}/${repo.name}/hooks`, {
            name: 'web',
            active: true,
            events: [
                'issues',
                'pull_request',
                'pull_request_review'
            ],
            config: {
                url: import.meta.env.VITE_DEPLOYED_URL + '/github/webhook/',
                content_type: 'json',
            },
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (res2.status !== 201) {
            console.error('Failed to create webhook:', res2.data);
            throw new Error('Failed to create webhook');
        }

        console.log('Webhook created:', res2.data);

        step.value = 'allDone';
        emit('change', repo.owner + '/' + repo.name);

    } catch (errorMsg) {
        console.error('Error creating webhook:', errorMsg);
        step.value = 'selectRepo';
        error.value = 'You do not have the necessary permissions to create a webhook in this repository';
    }
}

function backToUserSelection() {
    selectedUser.value = null;
    step.value = 'selectUser';
    selectedRepository.value = null;
    emit('change', '');
};

function backToPlaylistSelection() {
    selectedPlaylist.value = null;
    step2.value = 'selectPlaylist';
    emit('change', '');
};

function backToMusicSelection() {
    selectedMusic.value = null;
    step3.value = 'selectMusic';
    emit('change', '');
};

const isSupported = ref(false);
const isDefaultInput = ref(false);

const githubUsers = ref<User[]>([]);
const githubRepositories = ref<Repository[]>([]);

const spotifyPlaylists = ref<Playlist[]>([]);
const spotifyMusics = ref<Music[]>([]);
const search = ref<string>('');

if (props.type == 'text' || props.type == 'number' || props.type == 'email' || props.type == 'password'
    || props.type == 'date' || props.type == 'time' || props.type == 'month' || props.type == 'week'
    || props.type == 'file' || props.type == 'checkbox' || props.type == 'radio' || props.type == 'boolean') {
    isSupported.value = true;
    isDefaultInput.value = true;
}
if (props.type == 'textarea') {
    isSupported.value = true;
}
if (props.type == 'GithubRepository') {
    isSupported.value = true;
}

if (props.type == 'SpotifyPlaylist') {
    isSupported.value = true;
}

if (props.type == 'SpotifyMusic') {
    isSupported.value = true;
}

function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('change', target.value);
}

async function searchmusic() {
    const user = userStore.user;
    if (!user) return;
    const spotifyLinkedAccount = user.linkedAccounts.find(
            (account) => account.serviceName === 'spotify'
        );
        if (!spotifyLinkedAccount) return;
        const accessToken = spotifyLinkedAccount.authToken;
        if (!accessToken) return;
        if (!search.value) return;

        try {
            const res = await fetch(`https://api.spotify.com/v1/search?q=${search.value}&type=track`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            // store musics
            spotifyMusics.value = [];
            for (const music of data.tracks?.items || []) {
                spotifyMusics.value.push({
                    id: music.id,
                    name: music.name,
                    uri: music.uri,
                    external_urls: music.external_urls,
                    images: music.album.images,
                    artists: music.artists
                });
            }
        } catch (error) {
            console.error('Error fetching Spotify musics:', error);
        }
}

onMounted(async () => {
    const user = userStore.user;
    if (!user) return;

    if (props.type === 'GithubRepository') {
        const githubLinkedAccount = user.linkedAccounts.find(
            (account) => account.serviceName === 'github'
        );
        if (!githubLinkedAccount) return;

        const accessToken = githubLinkedAccount.authToken;
        if (!accessToken) return;

        try {
            // Fetch the repositories
            const res: { status: number, data: {
                id: number,
                name: string,
                owner: {
                    login: string,
                },
                visibility: string,
                html_url: string
            }[] }  = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status !== 200) {
                console.error('Failed to fetch GitHub repositories:', res.data);
                return;
            }

            const repositories = res.data;

            // Store repositories
            for (const repo of repositories) {
                githubRepositories.value.push({
                    id: repo.id,
                    name: repo.name,
                    owner: repo.owner.login,
                    visibility: repo.visibility,
                    url: repo.html_url,
                });
                if (githubUsers.value.find((user) => user.name === repo.owner.login)) continue;
                githubUsers.value.push({ id: githubUsers.value.length, name: repo.owner.login });
            }
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
        }
    }

    if (props.type === 'SpotifyPlaylist') {
        const spotifyLinkedAccount = user.linkedAccounts.find(
            (account) => account.serviceName === 'spotify'
        );
        if (!spotifyLinkedAccount) return;
        const accessToken = spotifyLinkedAccount.authToken;
        if (!accessToken) return;
        
        try {
            const res = await fetch('https://api.spotify.com/v1/me/playlists', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            // store playlists
            for (const playlist of data.items) {
                spotifyPlaylists.value.push({
                    id: playlist.id,
                    name: playlist.name,
                    uri: playlist.uri,
                    external_urls: playlist.external_urls,
                    images: playlist.images,
                    tracks: playlist.tracks
                });
            }
        } catch (error) {
            console.error('Error fetching Spotify playlists:', error);
        }
    }

});
</script>
