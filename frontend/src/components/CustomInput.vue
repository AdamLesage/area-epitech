<template>
    <div class="w-full">
        <input v-if="isSupported && isDefaultInput" :type="props.type" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full"
            @change="handleChange"/>
        <textarea v-if="type === 'textarea'" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] max-h-36 min-h-12 w-full"
            @change="handleChange"></textarea>
        <div v-if="!isSupported">"{{ props.type }}" type is not yet supported by CustomInput component</div>
        <div v-if="type === 'select'" class="text-[#333] rounded-lg max-w-xl mx-auto w-full">
            <label for="actionreaction" class="block mb-2 text-sm font-medium text-gray-700">
                Select {{ props.name }}
            </label>
            <select
                name="select"
                id="actionreaction-select"
                @change="handleChange"
                class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full bg-white"
            >
                <option
                    v-for="option in props.options"
                    :key="option + '-option'"
                    :value="option"
                    class="text-gray-900"
                >
                    {{ option }}
                </option>
            </select>
        </div>
        <div v-if="type === 'AreaSelect'" class="text-[#333] rounded-lg max-w-xl mx-auto w-full">
            <label for="actionreactionarea" class="block mb-2 text-sm font-medium text-gray-700">
                Select {{ props.name }}
            </label>
            <select
                name="select"
                id="actionreactionarea"
                @change="handleChange"
                class="border-gray-300 text-gray-700 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            >
                <option
                    v-for="area in areas"
                    :key="area.id"
                    :value="area.uuid"
                    class="text-gray-900"
                >
                    {{ area.title }}
                </option>
            </select>
        </div>
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
                        <img v-if="playlist.images && playlist.images[0]" :src="playlist.images[0].url" alt="Playlist Cover" class="w-8 h-8 rounded-md" />
                        <div class="flex flex-col">
                            <a aria-label="playlist name selection" :href="playlist.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{playlist.name}}</a>
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
                        <a aria-label="selected-playlist-name" :href="selectedPlaylist.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{selectedPlaylist.name}}</a>
                        <h4 class="text-white text-xs">{{ selectedPlaylist.tracks.total }} tracks</h4>
                    </div>
                    <button
                        aria-label="choose-another-playlist-spotify-button"
                        class="rounded-md text-sm text-[#fff] underline transition"
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
                        aria-label="search-music-spotify-button"
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
                            <a aria-label="music name selection" :href="music.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{music.name}}</a>
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
                        <a aria-label="selected-music-name" :href="selectedMusic.external_urls.spotify" target="_blank" class="text-white hover:text-blue-500 hover:underline">{{selectedMusic.name}}</a>
                        <h4 class="text-white text-xs">
                            <span v-for="(artist, index) in selectedMusic.artists" :key="artist.name">
                                {{ artist.name }}<span v-if="index < selectedMusic.artists.length - 1">, </span>
                            </span>
                        </h4>
                    </div>
                    <button
                        aria-label="choose-another-music-spotify-button"
                        class="rounded-md text-sm text-[#fff] underline transition"
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
                        <a aria-label="repository owner + name" :href="repo.url" target="_blank" class="text-white hover:text-blue-500 hover:underline">
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
                    aria-label="back-to-user-selection-github-button"
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
                        <a aria-label="selected-repository-owner-and-name" :href="selectedRepository.url" target="_blank" class="text-white hover:text-blue-500 hover:underline">
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
                    <button
                        aria-label="back-to-user-selection-end-github-button"
                        class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                        @click="backToUserSelection">
                        {{ action ? 'Connect' : 'Choose'}} Another Repository
                    </button>
                </div>
            </div>

            <p v-if="error" class="text-red-500 text-sm ml-2">{{ error }}</p>
        </div>

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
                            <i>No Guilds found.<br/>Verify you are correctly linked to Discord</i>
                        </div>
                        <button
                            aria-label="fetch-guilds-discord-button"
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
                            <button
                                aria-label="back-to-guild-selection-discord-button"
                                class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
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
                                aria-label="fetch-channels-discord-button"
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
                                <button
                                    aria-label="back-to-channel-selection-discord-button"
                                    class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                                    @click="backToChannelSelection">
                                    Choose Another Channel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="type === 'DiscordRoleName'" class="w-full">
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
                <div v-if="showSelect" class="w-full">
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
                            <i>No Guilds found.<br/>Verify you are correctly linked to Discord</i>
                        </div>
                        <button
                            aria-label="fetch-guilds-role-discord-button"
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
                            <button
                                aria-label="back-to-guild-selection-end-discord-button"
                                class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                                @click="backToGuildSelection">
                                Choose Another Guild
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="selectedGuild" class="w-full">
                    <div class="flex items-center gap-2 mb-2 mt-6" v-if="!selectedRole">
                        <h3 class="text-md font-semibold ml-2 text-[#333]">Choose a Role</h3>
                        <Icon v-if="required" icon="mdi:required" class="text-red-500" />
                    </div>
                    <div class="w-full flex h-12 bg-[#7289da] items-center justify-center rounded-md hover:cursor-pointer gap-2 relative"
                        @click="showSelect2 = !showSelect2"
                        v-if="!selectedRole">
                        <Icon icon="ic:baseline-discord" class="text-white w-6 h-6" />
                        <h2 class="text-white font-bold">Guild Roles</h2>
                    </div>
                    <div v-if="showSelect2 && !selectedRole" class="w-full">
                        <div class="max-h-64 w-full overflow-y-scroll rounded-md" v-if="selectedGuildRoles.length != 0">
                            <div
                                v-for="role in selectedGuildRoles"
                                :key="role.id"
                                class="bg-blue-50 p-2 pl-3 flex items-center hover:cursor-pointer hover:bg-blue-100"
                                @click="selectRole(role)">
                                <div class="flex gap-4 items-center w-full justify-center">
                                    <Icon icon="ic:baseline-discord" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                    <p class="overflow-hidden break-words text-ellipsis w-full text-[#333]">{{ role.name }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-[#777] text-sm text-center mt-4">
                            <i>No Roles found.<br/>Verify you are correctly linked to Discord</i>
                        </div>
                        <button
                            aria-label="fetch-roles-discord-button"
                            @click="fetchRoles(selectedGuild.id)"
                            class="w-full h-12 mt-4 bg-[#7289da] items-center justify-center text-md text-white rounded-md flex gap-4">
                            <Icon icon="mdi:reload" class="text-white w-6 h-6" />
                            <p class="text-white">Refetch</p>
                        </button>
                    </div>
                    <div v-else-if="selectedRole" class="mt-6">
                        <div class="bg-blue-50 p-2 pl-3 flex rounded-md justify-between items-center transition hover:cursor-pointer hover:bg-blue-100">
                            <div class="flex gap-2 items-center">
                                <Icon icon="mdi:hashtag" class="text-[#7289da] w-6 h-6 flex-shrink-0" />
                                <p class="text-[#333] hover:text-blue-500 hover:underline">
                                    {{ selectedRole.name }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center px-2 mt-2">
                            <div class="flex gap-2 items-center">
                                <h3 class="text-md font-semibold text-[#333]">Role Selected</h3>
                                <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            </div>
                            <button
                                aria-label="back-to-role-selection-discord-button"
                                class="rounded-md text-sm text-[#333] underline decoration-[#333] transition"
                                @click="backToRoleSelection">
                                Choose Another Role
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Discord Role Color and Type Selection -->
        <div v-if="type === 'DiscordRole'" class="w-full">
            <div class="mb-4">
                <label class="block text-[#333] font-semibold mb-2">Role Color</label>
                <select v-model="selectedColor" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full" @change="handleRoleChange">
                    <option v-for="color in roleColors" :key="color.name" :value="color.name">{{ color.display_name }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-[#333] font-semibold mb-2">Role Type</label>
                <select v-model="selectedType" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] w-full" @change="handleRoleChange">
                    <option v-for="type in roleTypes" :key="type.name" :value="type.name">{{ type.display_name }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { OptionType } from '@/types/services';
import { useUserStore } from '@/stores/user';
import { useServiceStore } from '@/stores/service';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { Area } from '@/types/area';
import { User } from '@/types/auth';

const userStore = useUserStore();
const serviceStore = useServiceStore();

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

interface GithubUser {
    id: number;
    name: string;
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

interface DiscordGuild {
    id: number;
    name: string;
}

interface DiscordRole {
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
    options: String [] | undefined;
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
const selectedUser = ref<GithubUser | null>(null);
const selectedRepository = ref<Repository | null>(null);
const selectedPlaylist = ref<Playlist | null>(null);
const selectedMusic = ref<Music | null>(null);
const filteredRepositories = computed(() =>
    githubRepositories.value.filter(
        (repo) =>
        repo.owner === selectedUser.value?.name
    )
);

const discordGuilds = ref<DiscordGuild[]>([]);
const selectedGuild = ref<DiscordGuild | null>(null);
const selectedGuildRoles = ref<DiscordRole[]>([]);
const selectedGuildChannels = ref<DiscordChannel[]>([]);
const selectedChannel = ref<DiscordChannel | null>(null);
const selectedRole = ref<DiscordRole | null>(null);
const showSelect = ref<boolean>(false);
const showSelect2 = ref<boolean>(false);

function backToRoleSelection() {
    selectedRole.value = null;
    showSelect2.value = true;
    emit('change', '');
}

async function fetchGuilds() {
    const user = userStore.user;
    if (!user) return;

    if (props.type === 'DiscordGuild' || props.type === 'DiscordGuildChannel') {
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

const roleColors = ref([
{ name: '#7289da', display_name: 'Blue' },
    { name: '#ff0000', display_name: 'Red' },
    { name: '#00ff00', display_name: 'Green' },
    { name: '#ffffff', display_name: 'White' },
    { name: '#000000', display_name: 'Black' },
    { name: '#ffff00', display_name: 'Yellow' },
    { name: '#ffa500', display_name: 'Orange' },
    { name: '#800080', display_name: 'Purple' }
]);
const roleTypes = ref([
    { name: 'explorer', display_name: 'Explorer' },
    { name: 'usual', display_name: 'Usual' },
    { name: 'admin', display_name: 'Admin' }
]);

const selectedColor = ref<string>(roleColors.value[0].name);
const selectedType = ref<string>(roleTypes.value[0].name);

function handleRoleChange() {
    emit('change', { color: selectedColor.value, type: selectedType.value });
}

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

async function selectGuild(guild: DiscordGuild) {
    selectedGuildChannels.value = [];

    // Check if the bot is already inside the guild
    const isAlreadyInGuild = await fetchChannels(guild.id);

    if (!isAlreadyInGuild) {
        const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/discord/redirect`;
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

async function fetchRoles(guildId: number): Promise<void> {
    const user = userStore.user;
    if (!user) return;
    const linkedAccount = user.linkedAccounts.find((account) => account.serviceName === 'discord');
    if (!linkedAccount) return;
    if (!guildId) return;

    try {
        const res: { status: number, data: { id: number, name: string }[] } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/discord/roles?guild_id=${guildId}`, {
            headers: {
                Authorization: `Bearer ${linkedAccount.authToken}`,
            },
        });

        if (res.status !== 200) {
            console.error('Failed to fetch Discord roles:', res.data);
            selectedGuildRoles.value = [];
            return;
        }

        selectedGuildRoles.value = res.data.map((role: { id: number, name: string }) => ({
            id: role.id,
            name: role.name,
        }));
    } catch (errorMsg) {
        console.error('Error fetching roles:', errorMsg);
    }
}

async function selectRole(role: DiscordRole) {
    selectedRole.value = role;
    if (!selectedGuild.value) return;
    emit('change', selectedGuild.value.id + '/' + role.id);
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

const githubUsers = ref<GithubUser[]>([]);
const githubRepositories = ref<Repository[]>([]);

const spotifyPlaylists = ref<Playlist[]>([]);
const spotifyMusics = ref<Music[]>([]);
const search = ref<string>('');

const areas = ref<Area[]>(userStore.areas);

if (props.type == 'text' || props.type == 'number' || props.type == 'email' || props.type == 'password'
    || props.type == 'date' || props.type == 'time' || props.type == 'month' || props.type == 'week'
    || props.type == 'file' || props.type == 'checkbox' || props.type == 'radio' || props.type == 'boolean'
    || props.type == 'datetime-local') {
    isSupported.value = true;
    isDefaultInput.value = true;
}

if (props.type == 'GithubRepository' ||
    props.type == 'DiscordGuild' ||
    props.type == 'DiscordGuildChannel' ||
    props.type == 'DiscordRole' ||
    props.type == 'DiscordRoleName' ||
    props.type == 'textarea' ||
    props.type == 'select' ||
    props.type == 'SpotifyPlaylist' ||
    props.type == 'SpotifyMusic' ||
    props.type == 'AreaSelect') {
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

async function handleSpotifyInput(user: User): Promise<void> {
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

onMounted(async () => {
    const user = userStore.user;
    if (!user) return;

    if (props.type === 'GithubRepository') {
        await handleGithubRepositoryInput(user);
    } else if (props.type === 'DiscordGuild' || props.type === 'DiscordGuildChannel') {
        await handleDiscordGuildInput(user);
    }
    if (props.type === 'DiscordRole') {
        handleRoleChange();
    }
    if (props.type === 'DiscordRoleName') {
        await handleDiscordGuildInput(user);
    }
    if (props.type === 'SpotifyPlaylist') {
        await handleSpotifyInput(user);
    }
});
</script>
