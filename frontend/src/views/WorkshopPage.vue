<template>
    <div :style="{ backgroundColor: '#333' }"
        class="flex flex-col justify-between before:bg-[url('@/assets/svg/Grid12.svg')] before:absolute before:w-full before:h-full overflow-hidden relative before:z-0"
        @click="workshopVisible = true"
        @wheel="handleScrollAttempt" v-if="!workshopVisible"
    >
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
        <div class="flex flex-col justify-center items-center z-10">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon icon="mdi:hammer-screwdriver" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1
                        class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">
                        Workshop</h1>
                </div>
            </div>

        </div>
        <div class="flex justify-center items-center p-4 mobile:hidden z-10">
            <ArrowComponentBottom color="white" class="mobile:hidden hover:cursor-pointer" :animate="true" />
        </div>
    </div>
    <div @wheel="handleScrollAttemptSecondPage" v-else>
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-full before:bg-[url('@/assets/svg/Grid12.svg')] before:absolute before:rotate-[12deg] before:w-[200%] before:h-[200%] before:top-[-50%] before:left-[-50%] overflow-hidden relative before:z-0"
            :style="{ backgroundColor: '#333' }">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
            <div class="flex justify-center items-center p-4 mobile:hidden z-10" v-if="scrollY == 0">
                <Icon icon="mdi:hammer-screwdriver" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">Workshop</h1>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-10"
                :style="{ backgroundColor: '#333' }" v-else>
                <ServiceNavScrollComponent
                    title="Workshop"
                    logo="mdi:hammer-screwdriver"
                    @back-button="handleBackButton"
                    :redirect="false"
                    class="bg-[#333]" />
            </div>
            <div />
        </div>
        <div class="flex flex-col items-center">
            <div class="flex justify-between w-[93%] mt-12 rounded-lg">
                <div class="w-1/2 flex justify-start gap-2 items-center">
                    <input type="text" class="w-full h-12 rounded-xl border-4 border-[#333] bg-[#333] text-white text-lg font-black text-start pl-4 placeholder:text-white/90"
                        v-model="title"
                        placeholder="Name your AREA" />
                    <div class="h-12 w-5 rounded-xl bg-[#333]" />
                    <div class="h-8 w-4 rounded-xl bg-[#333]" />
                </div>
                <div class="flex justify-end items-center w-1/2 gap-4">
                    <button class="w-36 h-12 rounded-xl bg-blue-500 text-white text-lg font-black hover:cursor-pointer shadow-lg"
                        @click="save">Save</button>
                    <button class="w-36 h-12 rounded-xl bg-red-500 text-white text-lg font-black hover:cursor-pointer shadow-lg"
                        @click="cancelSetup">Cancel Setup</button>
                </div>
            </div>
            <main class="w-full flex justify-center items-start gap-8 h-full mt-12">
                <section id="action" class="h-full w-full flex flex-col items-center justify-center" v-if="action">
                    <div class="w-[85%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer relative"
                        :style="{ backgroundColor: action.service.color }"
                        @click="redirectToAction">
                        <Icon :icon="action.service.icon" class="w-12 h-12 text-white" />
                        <h2 class="text-lg font-semibold text-white">{{ action.card.display_name }}</h2>
                        <h2 class="text-md font-semibold p-1 rounded-lg bg-white absolute bottom-3 right-3"
                            :style="{ color: action.service.color }">{{ action.category.display_name }}</h2>
                        <Icon
                            icon="material-symbols:cancel"
                            class="w-8 h-8 hover:cursor-pointer text-white hover:text-red-500 absolute top-3 left-3"
                            @click.stop="removeAction" />
                    </div>
                    <div class="flex justify-between w-[85%] px-4 items-center mt-4">
                        <h1 class="text-md font-black text-[#333]" v-if="!linkStatusAction">You need to connect to {{ action.service.name.charAt(0).toUpperCase() + action.service.name.slice(1) }} in order to have access to this action.</h1>
                        <h1 class="text-md font-black text-[#333]" v-else>You are correctly linked to {{ action.service.name.charAt(0).toUpperCase() + action.service.name.slice(1) }}.</h1>
                        <div class="flex w-full items-center justify-end">
                            <div
                                class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 cursor-pointer transition-transform duration-300"
                                @click.stop="switchActionLinkStatus">
                                <div
                                    v-if="!linkStatusAction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: action.service.color }"/>
                                <h1
                                    class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                    :style="{ color: action.service.color, textAlign: !linkStatusAction ? 'left' : 'right' }">
                                    {{ !linkStatusAction ? 'Not Linked' : 'Linked' }}
                                </h1>
                                <div
                                    v-if="linkStatusAction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: action.service.color }"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-[85%] h-16 justify-between px-4 my-4 items-center bg-gray-300 rounded-xl hover:cursor-pointer"
                        @click="showActionOptions = !showActionOptions">
                        <h2 class="text-lg text-[#333] font-black select-none">Configuration</h2>
                        <Icon icon="material-symbols:hide-rounded" class="w-8 h-8 text-[#333]"
                            v-if="showActionOptions" />
                        <Icon icon="eva:expand-fill" class="w-8 h-8 text-[#333]"
                            v-else />
                    </div>
                    <div class="w-[85%] h-full mb-4" v-if="showActionOptions && action?.card.options.length != 0">
                        <div class="w-full h-full flex flex-col items-start justify-start gap-4 rounded-xl shadow-md p-4 pb-8">
                            <div v-for="(option) in action?.card.options" :key="option.name" class="flex flex-col gap-2 px-8">
                                <label :for="option.name" class="text-black">• {{ option.display_name }}</label>
                                <div class="flex justify-start items-center">
                                    <CustomInput :id="option.name" :key="option.name" :type="option.type" :name="option.display_name" class="ml-4" :value="actionOptions[option.name]"
                                        @change="actionOptions[option.name] = $event.target.value" />
                                    <Icon icon="mdi:required"
                                        :class="{ 'text-gray-500': !option.required, 'text-red-500': option.required }"
                                        class="w-6 h-6 ml-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-[85%] h-full mb-4" v-if="showActionOptions && action?.card.options.length == 0">
                        <div class="w-full h-full flex flex-col items-start justify-center gap-4 rounded-xl shadow-md p-4 pb-4">
                            <h1 class="text-lg font-black text-[#333]">No configuration needed for this action.</h1>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start w-[85%] rounded-xl p-4 h-full shadow-lg"
                        :style="{ backgroundColor: action.service.color }">
                        <h1 class="text-lg font-black text-white">When {{ action.card.description.toLowerCase() }} on {{ action.service.name.charAt(0).toUpperCase() + action.service.name.slice(1) }}</h1>
                        <ul class="mt-4" v-if="action.card.options.length != 0">
                            <li v-for="(option, index) in action.card.options" :key="option.name">
                                <p class="text-lg font-black text-white break-words pl-8">
                                    • {{ (index == 0 ? 'where' : 'and where') }} 
                                    <span class="opacity-50">{{ option.display_name.toLowerCase() }}</span> is "
                                    <span class="underline decoration-2">{{ actionOptions[option.name] }}</span>"
                                </p>
                            </li>
                        </ul>
                    </div>
                </section>
                <section id="action" class="h-full w-full flex flex-col items-center justify-center" v-else>
                    <div class="flex w-[85%] h-16 justify-between px-4 my-4 items-center bg-gray-100 rounded-xl">
                        <h1 class="text-2xl text-center w-full font-black text-[#333]">No action selected</h1>
                    </div>
                    <div v-if="!actionSearch.service" class="w-[85%]">
                        <h1 class="text-2xl font-black text-[#333] pb-2">Select a Service</h1>
                        <div v-for="service in serviceStore.services.filter(service => service.categories.filter(category => category.actions.length > 0).length > 0)" :key="service.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] rounded-xl text-white hover:cursor-pointer shadow-lg"
                            @click="actionSearch.service = service"
                           >
                            <h1>-> {{ service.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="actionSearch.service && !actionSearch.category" class="w-[85%]">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-black text-[#333]">Select a Category</h1>
                            <button @click="actionSearch.service = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Change Service</button>
                        </div>
                        <div v-for="category in actionSearch.service.categories.filter(category => category.actions.length > 0)" :key="category.name" class="flex h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="actionSearch.category = category"
                           >
                            <h1>-> {{ category.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="actionSearch.service && actionSearch.category && !actionSearch.card" class="w-[85%]">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-black text-[#333]">Select an Action</h1>
                            <div class="flex justify-end gap-2">
                                <button @click="actionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Category</button>
                                <button @click="actionSearch.service = null; actionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Service</button>
                            </div>
                        </div>
                        <div v-for="card in actionSearch.category.actions" :key="card.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="actionSearch.card = card; changeAction()"
                           >
                            <h1>-> {{ card.display_name.toUpperCase() }}</h1>
                        </div>
                    </div>
                </section>
                <section id="bridge" class="h-full flex items-center justify-center mt-3">
                    <div class="flex flex-col items-center justify-center">
                        <Icon icon="foundation:arrow-right" class="w-28 h-28 text-[#333]" />
                    </div>
                </section>
                <section id="reaction" class="h-full w-full flex flex-col items-center justify-center" v-if="reaction">
                    <div class="w-[85%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer relative"
                        :style="{ backgroundColor: reaction.service.color }"
                        @click="redirectToReaction">
                        <Icon :icon="reaction.service.icon" class="w-12 h-12 text-white" />
                        <h2 class="text-lg font-semibold text-white">{{ reaction.card.display_name }}</h2>
                        <h2 class="text-md font-semibold p-1 rounded-lg bg-white absolute bottom-3 right-3"
                            :style="{ color: reaction.service.color }">{{ reaction.category.display_name }}</h2>
                        <Icon
                            icon="material-symbols:cancel"
                            class="w-8 h-8 hover:cursor-pointer text-white hover:text-red-500 absolute top-3 left-3"
                            @click.stop="removeReaction" />
                    </div>
                    <div class="flex justify-between w-[85%] px-4 items-center mt-4">
                        <h1 class="text-md font-black text-[#333]" v-if="!linkStatusReaction">You need to connect to {{ reaction.service.name.charAt(0).toUpperCase() + reaction.service.name.slice(1) }} in order to have access to this reaction.</h1>
                        <h1 class="text-md font-black text-[#333]" v-else>You are correctly linked to {{ reaction.service.name.charAt(0).toUpperCase() + reaction.service.name.slice(1) }}.</h1>
                        <div class="flex w-full items-center justify-end">
                            <div
                                class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 cursor-pointer transition-transform duration-300"
                                @click.stop="switchReactionLinkStatus">
                                <div
                                    v-if="!linkStatusReaction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: reaction.service.color }"/>
                                <h1
                                    class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                    :style="{ color: reaction.service.color, textAlign: !linkStatusReaction ? 'left' : 'right' }">
                                    {{ !linkStatusReaction ? 'Not Linked' : 'Linked' }}
                                </h1>
                                <div
                                    v-if="linkStatusReaction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: reaction.service.color }"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-[85%] h-16 justify-between px-4 my-4 items-center bg-gray-300 rounded-xl hover:cursor-pointer"
                        @click="showReactionOptions = !showReactionOptions">
                        <h2 class="text-lg text-[#333] font-black select-none">Configuration</h2>
                        <Icon icon="material-symbols:hide-rounded" class="w-8 h-8 text-[#333]"
                            v-if="showReactionOptions" />
                        <Icon icon="eva:expand-fill" class="w-8 h-8 text-[#333]"
                            v-else />
                    </div>
                    <div class="w-[85%] h-full mb-4" v-if="showReactionOptions && reaction?.card.options.length != 0">
                        <div class="w-full h-full flex flex-col items-start justify-start gap-4 rounded-xl shadow-md p-4 pb-8">
                            <div v-for="(option) in reaction?.card.options" :key="option.name" class="flex flex-col gap-2 px-8">
                                <label :for="option.name" class="text-black">• {{ option.display_name }}</label>
                                <div class="flex justify-start items-center">
                                    <CustomInput :id="option.name" :key="option.name" :type="option.type" :name="option.display_name" class="ml-4" :value="reactionOptions[option.name]"
                                        @change="reactionOptions[option.name] = $event.target.value" />
                                    <Icon icon="mdi:required"
                                        :class="{ 'text-gray-500': !option.required, 'text-red-500': option.required }"
                                        class="w-6 h-6 ml-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-[85%] h-full mb-4" v-if="showReactionOptions && reaction?.card.options.length == 0">
                        <div class="w-full h-full flex flex-col items-start justify-center gap-4 rounded-xl shadow-md p-4 pb-4">
                            <h1 class="text-lg font-black text-[#333]">No configuration needed for this reaction.</h1>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start w-[85%] rounded-xl p-4 h-full shadow-lg"
                        :style="{ backgroundColor: reaction.service.color }">
                        <h1 class="text-lg font-black text-white">Then {{ reaction.card.description.toLowerCase() }} on {{ reaction.service.name.charAt(0).toUpperCase() + reaction.service.name.slice(1) }}</h1>
                        <ul class="mt-4" v-if="reaction.card.options.length != 0">
                            <li v-for="(option, index) in reaction.card.options" :key="option.name">
                                <p class="text-lg font-black text-white break-words pl-8">
                                    • {{ (index == 0 ? 'with' : 'and with') }} 
                                    <span class="opacity-50">{{ option.display_name.toLowerCase() }}</span> as "
                                    <span class="underline decoration-2">{{ reactionOptions[option.name] }}</span>"
                                </p>
                            </li>
                        </ul>
                    </div>
                </section>
                <section id="reaction" class="h-full w-full flex flex-col items-center justify-center" v-else>
                    <div class="flex w-[85%] h-16 justify-between px-4 my-4 items-center bg-gray-100 rounded-xl">
                        <h1 class="text-2xl text-center w-full font-black text-[#333]">No reaction selected</h1>
                    </div>
                    <div v-if="!reactionSearch.service" class="w-[85%]">
                        <h1 class="text-2xl font-black text-[#333] pb-2">Select a Service</h1>
                        <div v-for="service in serviceStore.services.filter(service => service.categories.filter(category => category.reactions.length > 0).length > 0)" :key="service.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] rounded-xl text-white hover:cursor-pointer shadow-lg"
                            @click="reactionSearch.service = service"
                           >
                            <h1>-> {{ service.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="reactionSearch.service && !reactionSearch.category" class="w-[85%]">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-black text-[#333]">Select a Category</h1>
                            <button @click="reactionSearch.service = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Change Service</button>
                        </div>
                        <div v-for="category in reactionSearch.service.categories.filter(category => category.reactions.length > 0)" :key="category.name" class="flex h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="reactionSearch.category = category"
                           >
                            <h1>-> {{ category.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="reactionSearch.service && reactionSearch.category && !reactionSearch.card" class="w-[85%]">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-black text-[#333]">Select a Reaction</h1>
                            <div class="flex justify-end gap-2">
                                <button @click="reactionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Category</button>
                                <button @click="reactionSearch.service = null; reactionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Service</button>
                            </div>
                        </div>
                        <div v-for="card in reactionSearch.category.reactions" :key="card.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="reactionSearch.card = card; changeReaction()"
                           >
                            <h1>-> {{ card.display_name.toUpperCase() }}</h1>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
import { usePopupStore } from '@/stores/popup';
import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/user';
import BackButton from '@/components/BackButton.vue';
import NavButton from '@/components/NavButton.vue';
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import CustomInput from '@/components/CustomInput.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { Action, Reaction, Category, Service } from '@/types/services';
import axios from 'axios';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import ArrowComponentBottom from '@/components/ArrowComponentBottom.vue';
import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import Cookies from 'js-cookie';
import { User, LinkedAccount } from '@/types/auth';

const store = usePopupStore();
const serviceStore = useServiceStore();
const userStore = useUserStore();
const router = useRouter();

store.display = false;

const action = ref<{
    card: Action,
    category: Category,
    service: Service
} | null>(store.action);
const reaction = ref<{
    card: Reaction,
    category: Category,
    service: Service
} | null>(store.reaction);
const title = ref<string>(store.title);

const showReactionOptions = ref(false);
const showActionOptions = ref(false);
const linkStatusAction = ref(false);
const linkStatusReaction = ref(false);
const workshopVisible = ref(false);

const reactionSearch = ref<{
    service: Service | null,
    category: Category | null,
    card: Reaction | null
}>({
    service: null,
    category: null,
    card: null
});

const actionSearch = ref<{
    service: Service | null,
    category: Category | null,
    card: Action | null
}>({
    service: null,
    category: null,
    card: null
});

const scrollY = ref(0);

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})

function handleScrollAttempt(event: WheelEvent) {
    if (event.deltaY > 0) {
        workshopVisible.value = true;
    }
}

function handleScrollAttemptSecondPage(event: WheelEvent) {
    if (event.deltaY < 0 && scrollY.value === 0) {
        workshopVisible.value = false;
    }
}

function changeReaction() {
    store.display = false;
    store.reaction = {
        card: reactionSearch.value.card!,
        category: reactionSearch.value.category!,
        service: reactionSearch.value.service!
    };
    reaction.value = store.reaction;
    const linkedAccount = userStore.user?.linkedAccounts.find(linkedAccount => linkedAccount.serviceName === reaction.value?.service.name);
    linkStatusReaction.value = linkedAccount ? true : false;
}

function changeAction() {
    store.display = false;
    store.action = {
        card: actionSearch.value.card!,
        category: actionSearch.value.category!,
        service: actionSearch.value.service!
    };
    action.value = store.action;
    const linkedAccount = userStore.user?.linkedAccounts.find(linkedAccount => linkedAccount.serviceName === action.value?.service.name);
    linkStatusAction.value = linkedAccount ? true : false;
    console.log('Action:', action.value);
    console.log('linkStatusAction:', linkStatusAction.value);
    console.log('linkedAccount:', linkedAccount);
}

function removeReaction() {
    store.reaction = null;
    reaction.value = null;
    reactionSearch.value = {
        service: null,
        category: null,
        card: null
    };
    linkStatusReaction.value = false;
}

function removeAction() {
    store.action = null;
    action.value = null;
    actionSearch.value = {
        service: null,
        category: null,
        card: null
    };
    linkStatusAction.value = false;
}

const actionOptions = ref<Record<string, string>>(store.actionData);
const reactionOptions = ref<Record<string, string>>(store.reactionData);

const actionCardOptions = computed(() => action.value?.card.options);
const reactionCardOptions = computed(() => reaction.value?.card.options);

watch(() => action.value, (newValue) => {
    if (newValue) {
        actionOptions.value = {};
        for (const option of newValue.card.options) {
            actionOptions.value[option.name] = '';
        }
    }
});

watch(() => reaction.value, (newValue) => {
    if (newValue) {
        reactionOptions.value = {};
        for (const option of newValue.card.options) {
            reactionOptions.value[option.name] = '';
        }
    }
});

if (actionCardOptions.value) {
    for (const option of actionCardOptions.value) {
        if (!actionOptions.value[option.name])
            actionOptions.value[option.name] = '';
    }
}

if (reactionCardOptions.value) {
    for (const option of reactionCardOptions.value) {
        if (!reactionOptions.value[option.name])
            reactionOptions.value[option.name] = '';
    }
}

watch(() => actionOptions.value, (newValue) => {
    store.actionData = newValue;
});

watch(() => reactionOptions.value, (newValue) => {
    store.reactionData = newValue;
});

watch(() => title.value, (newValue) => {
    store.title = newValue;
});

// fill action data and reaction data with '' values for each option

async function save() {
    if (title.value === '') {
        alert('Please enter a title for your AREA');
        return;
    }
    if (!action.value || !reaction.value) {
        alert('Please select an action and a reaction');
        return;
    }

    if (linkStatusAction.value === false) {
        alert('Please link your account to the action service');
        return;
    }

    if (linkStatusReaction.value === false) {
        alert('Please link your account to the reaction service');
        return;
    }

    // Check for required options not filled

    const actionCardOptions = action.value.card.options;
    const reactionCardOptions = reaction.value.card.options;

    for (const option of actionCardOptions) {
        console.log('Option:', option);
        console.log('Value:', actionOptions.value[option.name]);
        if (option.required && actionOptions.value[option.name] === '') {
            alert('Please fill in all required options for the action');
            return;
        }
    }

    for (const option of reactionCardOptions) {
        console.log('Option:', option);
        console.log('Value:', reactionOptions.value[option.name]);
        if (option.required && reactionOptions.value[option.name] === '') {
            alert('Please fill in all required options for the reaction');
            return;
        }
    }

    if (action.value.card.options.some(option => option.required && actionOptions.value[action.value!.card.options.indexOf(option)] === '')) {
        alert('Please fill in all required options for the action');
        return;
    }

    if (reaction.value.card.options.some(option => option.required && reactionOptions.value[reaction.value!.card.options.indexOf(option)] === '')) {
        alert('Please fill in all required options for the reaction');
        return;
    }

    const user = userStore.user;
    if (!user) {
        alert('User is not logged in.');
        return;
    }

    console.log('Area created with:', {
        title: title.value,
        action: action.value,
        reaction: reaction.value,
        uuid: user.uuid,
    });

    const token = Cookies.get('token');

    console.log('Action data:', actionOptions.value);
    console.log('Reaction data:', reactionOptions.value);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/action`, {
        title: title.value,
        typeAction: action.value.card.name,
        typeReaction: reaction.value.card.name,
        reactionData: actionOptions.value,
        actionData: reactionOptions.value,
    },{
        headers: {
            Authorization: token,
        },
    });

    if (response.status !== 201) {
        alert('Error while creating area');
        return;
    }
    alert('AREA successfully created!');
}

function cancelSetup() {
    console.log('Setup cancelled.');
    router.go(-1);
    store.display = true;
    store.title = title.value;
}

function handleBackButton() {
    console.log('Back button clicked');
    router.push('/dashboard');
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

function switchActionLinkStatus() {
    linkStatusAction.value = !linkStatusAction.value;
    if (action.value?.service.name == reaction.value?.service.name) {
        linkStatusReaction.value = linkStatusAction.value;
    }
}

function switchReactionLinkStatus() {
    linkStatusReaction.value = !linkStatusReaction.value;
    if (action.value?.service.name == reaction.value?.service.name) {
        linkStatusAction.value = linkStatusReaction.value;
    }
}

function handleExploreRedirect() {
    console.log('Redirecting to explore');
}

function handleMyAreasRedirect() {
    console.log('Redirecting to my areas');
}

function handleUpdatesRedirect() {
    console.log('Redirecting to updates');
}

function handleUserProfileRedirect() {
    console.log('Redirecting to user profile');
}

function redirectToAction() {
    console.log('Redirecting to action:', action.value?.card.display_name);
    router.push(`/service/${action.value?.service.name}/category/${action.value?.category.name}/action/${action.value?.card.name}`);
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

function redirectToReaction() {
    console.log('Redirecting to reaction:', reaction.value?.card.display_name);
    router.push(`/service/${reaction.value?.service.name}/category/${reaction.value?.category.name}/reaction/${reaction.value?.card.name}`);
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

onMounted(async() => {
    const email = Cookies.get('email');
    const token = Cookies.get('token');

    if (!email && !token) {
        console.error('Not logged in.');
        router.push('/');
        return;
    } else {
        const user = userStore.user;
        console.log(user);
        if (!user) {
            const res: { status: number, data: User } = await axios.get<User>(
                `${import.meta.env.VITE_BACKEND_URL}/api/user`,
                {
                    params: {
                        email: email,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res);
            if (res.status === 200) {
                console.log('User fetched successfully');
                userStore.setUser(res.data);
            } else {
                console.log('User fetching failed');
                router.push('/');
                Cookies.remove('email');
                Cookies.remove('token');
            }
        }
    }
    // Fetch the different linked accounts from the API
    const user = userStore.user;
    if (user) {
        user.linkedAccounts = [];
        const res: { status: number, data: LinkedAccount[] } = await axios.get<LinkedAccount[]>(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/${user.uuid}/linked-accounts`,
            {
                params: {
                    uuid: user.uuid,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(res);
        const linkedAccounts = res.data;

        for (const linkedAccount of linkedAccounts) {
            console.log('Linked account:', linkedAccount);
            user.linkedAccounts.push(linkedAccount);
        }

        if (action.value && action.value.service) {
            linkStatusAction.value = user.linkedAccounts.some(linkedAccount => linkedAccount.serviceName === action.value?.service.name);
        }

        if (reaction.value && reaction.value.service) {
            linkStatusReaction.value = user.linkedAccounts.some(linkedAccount => linkedAccount.serviceName === reaction.value?.service.name);
        }
    }

    // Fetch the different services from the API
    console.log(import.meta.env.VITE_BACKEND_URL);
    const response: { status: number, data: { services: Service[] }} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/services-info.json`);
    console.log(response);
    if (response.status !== 200) {
        console.error('Error while fetching services');
        return;
    }
    const services = response.data.services;
    for (const service of services) {
        serviceStore.setNewService(service);
        console.log('Service:', service, 'added to serviceStore:', serviceStore.services);
    }
})
</script>

<style scoped>
</style>
