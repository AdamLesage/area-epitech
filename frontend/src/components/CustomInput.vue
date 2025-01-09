<template>
    <div class="w-full">
        <input v-if="isSupported && isDefaultInput" :type="props.type" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full"
            @change="handleChange"/>
        <textarea v-if="type === 'textarea'" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] max-h-36 min-h-12 w-full"
            @change="handleChange"></textarea>
        <div v-if="!isSupported">"{{ props.type }}" type is not yet supported by CustomInput component</div>
        <div v-if="type === 'DiscordGuild' || type === 'DiscordGuildChannel'" class="w-full">
            <div class="flex items-center gap-2 mb-2" v-if="!selectedGuild">
                <h3 class="text-md font-semibold ml-2 text-[#333]">Connect a Guild</h3>
                <Icon v-if="required" icon="mdi:required" class="text-red-500" />
            </div>
            <div class="flex w-full justify-center relative flex-col">
                <div class="w-full flex h-12 bg-[#7289da] items-center justify-center rounded-md hover:cursor-pointer gap-2 relative"
                    @click="showSelect = !showSelect"
                    v-if="!selectedGuild">
                    <Icon icon="ic:baseline-discord" class="text-white w-6 h-6" />
                    <h2 class="text-white font-bold">Your Guilds</h2>
                </div>
                <div
                    v-if="showSelect" class="w-full">
                    <div v-if="!selectedGuild">
                        <div class="max-h-64 w-full overflow-y-scroll rounded-md" v-if="discordGuilds.length != 0">
                            <div
                                v-for="guild in discordGuilds"
                                :key="guild.id"
                                class="bg-blue-50 p-2 pl-3 flex items-center hover:cursor-pointer hover:bg-blue-100"
                                @click="selectGuild(guild)">
                                <div class="flex gap-4 items-center w-full justify-center">
                                    <Icon icon="ic:baseline-discord" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                    <p class="overflow-hidden break-words text-ellipsis w-full text-[#333]">{{ guild.name }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-[#777] text-sm text-center mt-4">
                            <i>No Guilds found.<br/>Verify you are correctly linked to Github</i>
                        </div>
                        <button
                            @click="fetchGuilds"
                            class="w-full h-12 mt-4 bg-[#7289da] items-center justify-center text-md text-white rounded-md flex gap-4">
                            <Icon icon="mdi:reload" class="text-white w-6 h-6" />
                            <p class="text-white">Refetch</p>
                        </button>
                    </div>
                    <div v-else>
                        <div class="bg-blue-50 p-2 pl-3 flex rounded-md justify-between items-center transition hover:cursor-pointer hover:bg-blue-100">
                            <div class="flex gap-2 items-center">
                                <Icon icon="ic:baseline-discord" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                <p class="text-[#333] hover:text-blue-500 hover:underline"
                                    @click="redirectToGuildOnDiscord(selectedGuild.id)">
                                    {{ selectedGuild.name }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center px-2 mt-2">
                            <div class="flex gap-2 items-center">
                                <h3 class="text-md font-semibold text-[#333]">Guild Connected</h3>
                                <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            </div>
                            <button class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                                @click="backToGuildSelection">
                                Choose Another Guild
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="type == 'DiscordGuildChannel'" class="w-full">
                    <div class="flex items-center gap-2 mb-2 mt-6" v-if="!selectedChannel && selectedGuild">
                        <h3 class="text-md font-semibold ml-2 text-[#333]">Choose the Channel</h3>
                        <Icon v-if="required" icon="mdi:required" class="text-red-500" />
                    </div>
                    <div class="w-full flex h-12 bg-[#7289da] items-center justify-center rounded-md hover:cursor-pointer gap-2 relative"
                        @click="showSelect2 = !showSelect2"
                        v-if="!selectedChannel && selectedGuild">
                        <Icon icon="ic:baseline-discord" class="text-white w-6 h-6" />
                        <h2 class="text-white font-bold">Guild Channel</h2>
                    </div>
                    <div
                        v-if="showSelect2" class="w-full">
                        <div class="w-full" v-if="!selectedGuild && !selectedChannel">
                            <div class="text-[#777] text-sm text-center mt-4 flex flex-col gap-4">
                                <p>
                                    <i>No Channels found.<br/>Please select a Guild first</i>
                                </p>
                            </div>
                        </div>
                        <div class="w-full" v-else-if="!selectedChannel && selectedGuild">
                            <div class="max-h-64 w-full overflow-y-scroll rounded-md" v-if="selectedGuild && selectedGuildChannels.length > 0">
                                <div
                                    v-for="channel in selectedGuildChannels"
                                    :key="channel.id"
                                    class="bg-blue-50 p-2 pl-3 flex items-center hover:cursor-pointer hover:bg-blue-100"
                                    @click="selectChannel(channel)">
                                    <div class="flex gap-4 items-center w-full justify-center">
                                        <Icon icon="ic:baseline-discord" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                        <p class="overflow-hidden break-words text-ellipsis w-full text-[#333]">{{ channel.name }}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                @click="fetchChannels(selectedGuild.id)"
                                class="w-full h-12 bg-[#7289da] items-center justify-center text-md text-white rounded-md flex gap-4">
                                <Icon icon="mdi:reload" class="text-white w-6 h-6" />
                                <p class="text-white">Refetch</p>
                            </button>
                        </div>
                        <div v-else-if="selectedGuild && selectedChannel" class="mt-6">
                            <div class="bg-blue-50 p-2 pl-3 flex rounded-md justify-between items-center transition hover:cursor-pointer hover:bg-blue-100">
                                <div class="flex gap-2 items-center">
                                    <Icon icon="mdi:hashtag" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                    <p class="text-[#333] hover:text-blue-500 hover:underline"
                                        @click="redirectToChannelOnDiscord(selectedGuild.id, selectedChannel.id)">
                                        {{ selectedChannel.name }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center px-2 mt-2">
                                <div class="flex gap-2 items-center">
                                    <h3 class="text-md font-semibold text-[#333]">Channel is Correct</h3>
                                    <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                                </div>
                                <button class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                                    @click="backToChannelSelection">
                                    Choose Another Channel
                                </button>
                            </div>
                        </div>
                    </div>
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
                <h3 class="text-md font-semibold my-2 ml-2 text-[#333]">1. Select a User</h3>
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
                <h3 class="text-md font-semibold ml-2 my-2 text-[#333]">2. Select a Repository</h3>
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
                <h3 class="text-md font-semibold ml-2 mt-2 text-[#333]">3. Add Webhook</h3>
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
                        <h3 class="text-md font-semibold text-[#333]">All Done {{ action ? '(Connected)' : ''}}</h3>
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
import { User } from '@/types/auth';

const userStore = useUserStore();

interface Repository {
    id: number;
    name: string;
    owner: string;
    visibility: string;
    url: string;
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

interface GithubUser {
    id: number;
    name: string;
}

interface DiscordGuild {
    id: number;
    name: string;
}

interface DiscordChannel {
    id: number;
    name: string;
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

// Github
const step = ref<'selectUser' | 'selectRepo' | 'addWebhook' | 'allDone'>('selectUser');
const selectedUser = ref<GithubUser | null>(null);
const selectedRepository = ref<Repository | null>(null);

// Discord
const discordGuilds = ref<DiscordGuild[]>([]);
const selectedGuild = ref<DiscordGuild | null>(null);
const selectedGuildChannels = ref<DiscordChannel[]>([]);
const selectedChannel = ref<DiscordChannel | null>(null);
const showSelect = ref<boolean>(false);
const showSelect2 = ref<boolean>(false);

const filteredRepositories = computed(() =>
    githubRepositories.value.filter(
        (repo) =>
        repo.owner === selectedUser.value?.name
    )
);

async function selectGuild(guild: DiscordGuild) {
    selectedGuildChannels.value = [];

    // Check if the bot is already inside the guild
    const isAlreadyInGuild = await fetchChannels(guild.id);

    if (!isAlreadyInGuild) {
        const redirectUri = 'http://localhost:8080/discord/redirect'
        window.open(`https://discord.com/oauth2/authorize?client_id=1326285888266829884&scope=bot%20guilds&permissions=8&guild_id=${guild.id}&redirect_uri=${redirectUri}&response_type=code`, '_blank');
    }
    selectedGuild.value = guild;
    if (props.type == 'DiscordGuild') {
        emit('change', guild.id.toString());
    }
}

async function fetchChannels(guildId: number): Promise<boolean> {
    const user = userStore.user;
    if (!user) return false;
    const linkedAccount = user.linkedAccounts.find((account) => account.serviceName === 'discord');
    if (!linkedAccount) return false;
    if (!guildId) return false;

    try {
        const res: { status: number, data: { id: number, name: string, type: number }[] } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/discord/channels?guild_id=${guildId}`, {
        });

        console.log(res);
        if (res.status !== 200) {
            console.error('Failed to fetch Discord guilds:', res.data);
            selectedGuildChannels.value = [];
            return false;
        }

        selectedGuildChannels.value = res.data.map((channel: { id: number, name: string, type: number }) => {
            if (channel.type !== 0) return null;
            return {
                id: channel.id,
                name: channel.name
            };
        }).filter((channel: DiscordChannel | null) => channel !== null) as DiscordChannel[];
    } catch (errorMsg) {
        console.error('Error fetching channels:', errorMsg);
        return false;
    }
    return true;
}

async function selectChannel(channel: DiscordChannel) {
    selectedChannel.value = channel;
    if (!selectedGuild.value) return;
    emit('change', selectedGuild.value.id + '/' + channel.id);
}

async function redirectToGuildOnDiscord(guildId: number) {
    window.open(`https://discord.com/channels/${guildId}`, '_blank');
}

async function redirectToChannelOnDiscord(guildId: number, channelId: number) {
    window.open(`https://discord.com/channels/${guildId}/${channelId}`, '_blank');
}

function selectUser(user: GithubUser) {
    selectedUser.value = user;
    step.value = 'selectRepo';
};

async function selectRepository(repo: Repository) {
    selectedRepository.value = repo;
    error.value = null;

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
                insecure_ssl: '1',
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
    error.value = null;
    emit('change', '');
};

function backToGuildSelection() {
    selectedGuild.value = null;
    selectedChannel.value = null;
    showSelect.value = true;
    showSelect2.value = false;
    emit('change', '');
}

function backToChannelSelection() {
    selectedChannel.value = null;
    showSelect2.value = true;
    emit('change', '');
}

const isSupported = ref(false);
const isDefaultInput = ref(false);

const githubUsers = ref<GithubUser[]>([]);
const githubRepositories = ref<Repository[]>([]);

if (props.type == 'text' || props.type == 'number' || props.type == 'email' || props.type == 'password'
    || props.type == 'date' || props.type == 'time' || props.type == 'month' || props.type == 'week'
    || props.type == 'file' || props.type == 'checkbox' || props.type == 'radio' || props.type == 'boolean') {
    isSupported.value = true;
    isDefaultInput.value = true;
}
if (props.type == 'GithubRepository' ||
    props.type == 'DiscordGuild' ||
    props.type == 'DiscordGuildChannel' ||
    props.type == 'textarea') {
    isSupported.value = true;
}

function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('change', target.value);
}

async function handleGithubRepositoryInput(user: User): Promise<void> {
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

async function fetchGuilds() {
    const user = userStore.user;
    if (!user) return;

    if (props.type === 'DiscordGuild') {
        await handleDiscordGuildInput(user);
    }
}

async function handleDiscordGuildInput(user: User): Promise<void> {
    // Ask the user to select a discord server for our app
    // Set the redirect url to the backend
    // The backend will handle the OAuth2 flow
    const linkedAccount = user.linkedAccounts.find((account) => account.serviceName === 'discord');
    if (!linkedAccount) return;
    console.log('Discord Linked Account:', linkedAccount);
    
    try {
        const res: { status: number, data: { id: number, name: string, owner: boolean }[] } = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${linkedAccount.authToken}`,
            },
        });

        console.log('Discord Guilds:', res);

        if (res.status !== 200) {
            console.error('Failed to fetch Discord guilds:', res.data);
            return;
        }

        // Only take thoses where owner: true
        discordGuilds.value = res.data.filter(guild => guild.owner).map(guild => ({
            id: guild.id,
            name: guild.name
        }));

    } catch (error) {
        console.error('Error fetching Discord guilds:', error);
    }
}

onMounted(async () => {
    const user = userStore.user;
    if (!user) return;

    if (props.type === 'GithubRepository') {
        await handleGithubRepositoryInput(user);
    } else if (props.type === 'DiscordGuild' || props.type === 'DiscordGuildChannel') {
        await handleDiscordGuildInput(user);
    }
});
</script>
