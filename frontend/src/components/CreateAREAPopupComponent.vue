<template>
    <!-- In the style of gmail create Mail popup -->
     <!-- Minimal view -->
    <div class="fixed w-[30rem] h-[2.5rem] bottom-4 right-4 rounded-xl shadow-2xl" v-if="popupView == 'Minimal'">
        <header class="bg-gray-300 rounded-xl px-4 py-2 flex justify-between items-center hover:cursor-pointer" @click="normalView">
            <h1 class="text-[#333] font-black">New AREA</h1>
            <div class="flex justify-end items-center gap-1">
                <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="normalView">
                    <Icon icon="heroicons:plus-20-solid" class="w-6 h-6 text-[#333]" />
                </button>
                <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="resetPopup">
                    <Icon icon="eva:close-outline" class="w-6 h-6 text-[#333]" />
                </button>
            </div>
        </header>
    </div>
    <!-- Normal view -->
    <div class="fixed w-[30rem] h-[29.5rem] bottom-4 right-4 rounded-xl shadow-2xl" v-if="popupView == 'Normal'">
        <header class="bg-gray-300 rounded-t-xl px-4 py-2 flex justify-between items-center hover:cursor-pointer" @click="minimalView">
            <h1 class="text-[#333] font-black">New AREA</h1>
            <div class="flex justify-end items-center gap-1">
                <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="minimalView">
                    <Icon icon="heroicons:minus-20-solid" class="w-6 h-6 text-[#333]" />
                </button>
                <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="extendedView">
                    <Icon icon="heroicons:plus-20-solid" class="w-6 h-6 text-[#333]" />
                </button>
                <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="resetPopup">
                    <Icon icon="eva:close-outline" class="w-6 h-6 text-[#333]" />
                </button>
            </div>
        </header>
        <input type="text" class="w-full py-2 px-4 text-[#333]" placeholder="Enter title" v-model="areaTitle">
        <div class="bg-gray-100 h-[352px] flex justify-center flex-col">
            <Icon icon="mdi:arrow" class="w-36 h-36 text-[#111] absolute rotate-90 right-0" />
            <section id="action" class="h-1/2 w-full flex items-center justify-center">
                <div v-if="actionSelected" class="w-[75%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer"
                    :style="{ backgroundColor: actionSelected.service.color }"
                    @click="redirectToAction">
                    <Icon
                        :icon="hoverActionIcon ? 'material-symbols:cancel' : 'material-symbols:check-circle'"
                        class="w-8 h-8 hover:cursor-pointer"
                        :class="hoverActionIcon ? 'text-red-500' : 'text-white'"
                        @mouseenter="hoverActionIcon = true"
                        @mouseleave="hoverActionIcon = false"
                        @click.stop="removeAction" />
                    <h2 class="text-lg font-semibold text-white">{{ actionSelected.card.display_name }}</h2>
                </div>
                <div v-else class="w-[75%] h-32 bg-gray-300 rounded-xl flex items-center justify-center">
                    <h2 class="text-lg font-semibold text-center text-[#444]">Select an action</h2>
                </div>
            </section>
            <section id="reaction" class="h-1/2 w-full flex items-center justify-center">
                <div v-if="reactionSelected" class="w-[75%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer"
                    :style="{ backgroundColor: reactionSelected.service.color }"
                    @click="redirectToReaction">
                    <Icon
                        :icon="hoverReactionIcon ? 'material-symbols:cancel' : 'material-symbols:check-circle'"
                        class="w-8 h-8 hover:cursor-pointer"
                        :class="hoverReactionIcon ? 'text-red-500' : 'text-white'"
                        @mouseenter="hoverReactionIcon = true"
                        @mouseleave="hoverReactionIcon = false"
                        @click.stop="removeReaction" />
                    <h2 class="text-lg font-semibold text-white">{{ reactionSelected.card.display_name }}</h2>
                </div>
                <div v-else class="w-[75%] h-32 bg-gray-300 rounded-xl flex items-center justify-center">
                    <h2 class="text-lg font-semibold text-center text-[#444]">Select a reaction</h2>
                </div>
            </section>
        </div>
        <button class="w-full text-white rounded-b-xl h-[40px] bg-blue-500 hover:cursor-pointer"
            @click="create">Continue</button>
    </div>
    <!-- Extended view -->
    <div class="fixed w-full h-full top-0 bg-black/30 flex justify-center items-center z-50" v-if="popupView == 'Extended'" @click="normalView">
        <div class="w-[60rem] h-[40rem] m-auto rounded-xl shadow-2xl relative flex flex-col items-center bg-gray-100 " @click.stop>
            <header class="bg-gray-300 rounded-t-xl px-4 py-2 flex justify-between items-center hover:cursor-pointer w-full" @click="normalView">
                <h1 class="text-[#333] font-black">New AREA</h1>
                <div class="flex justify-end items-center gap-1">
                    <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="normalView">
                        <Icon icon="heroicons:minus-20-solid" class="w-6 h-6 text-[#333]" />
                    </button>
                    <button class="rounded-full text-2xl hover:bg-gray-400 flex items-center justify-center" @click.stop="resetPopup">
                        <Icon icon="eva:close-outline" class="w-6 h-6 text-[#333]" />
                    </button>
                </div>
            </header>
            <input type="text" class="w-full py-2 px-4 text-[#333]" placeholder="Enter title" v-model="areaTitle">
            <div class="bg-gray-100 h-full my-1 flex justify-center flex-col w-[30rem] relative">
                <Icon icon="mdi:arrow" class="w-36 h-36 text-[#111] absolute rotate-90 right-0" />
                <section id="action" class="h-[176px] w-full flex items-center justify-center">
                    <div v-if="actionSelected" class="w-[75%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer"
                        :style="{ backgroundColor: actionSelected.service.color }"
                        @click="redirectToAction">
                        <Icon
                            :icon="hoverActionIcon ? 'material-symbols:cancel' : 'material-symbols:check-circle'"
                            class="w-8 h-8 hover:cursor-pointer"
                            :class="hoverActionIcon ? 'text-red-500' : 'text-white'"
                            @mouseenter="hoverActionIcon = true"
                            @mouseleave="hoverActionIcon = false"
                            @click.stop="removeAction" />
                        <h2 class="text-lg font-semibold text-white">{{ actionSelected.card.display_name }}</h2>
                    </div>
                    <div v-else class="w-[75%] h-32 bg-gray-300 rounded-xl flex items-center justify-center">
                        <h2 class="text-lg font-semibold text-center text-[#444]">Select an action</h2>
                    </div>
                </section>
                <section id="reaction" class=" h-[176px] w-full flex items-center justify-center">
                    <div v-if="reactionSelected" class="w-[75%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer"
                        :style="{ backgroundColor: reactionSelected.service.color }"
                        @click="redirectToReaction">
                        <Icon
                            :icon="hoverReactionIcon ? 'material-symbols:cancel' : 'material-symbols:check-circle'"
                            class="w-8 h-8 hover:cursor-pointer"
                            :class="hoverReactionIcon ? 'text-red-500' : 'text-white'"
                            @mouseenter="hoverReactionIcon = true"
                            @mouseleave="hoverReactionIcon = false"
                            @click.stop="removeReaction" />
                        <h2 class="text-lg font-semibold text-white">{{ reactionSelected.card.display_name }}</h2>
                    </div>
                    <div v-else class="w-[75%] h-32 bg-gray-300 rounded-xl flex items-center justify-center">
                        <h2 class="text-lg font-semibold text-center text-[#444]">Select a reaction</h2>
                    </div>
                </section>
            </div>
            <button class="w-full text-white rounded-b-xl h-[60px] bg-blue-500 hover:cursor-pointer"
                @click="create">Continue</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Action, Reaction, Category, Service } from '@/types/services';
import { Icon } from '@iconify/vue';

interface ComponentProps {
    action: null | {
        card: Action,
        category: Category,
        service: Service
    };
    reaction: null | {
        card: Reaction,
        category: Category,
        service: Service
    };
    title: string;
    view: 'Extended' | 'Normal' | 'Minimal';
}

const props = defineProps<ComponentProps>();
const router = useRouter();

const actionSelected = ref<{
    card: Action,
    category: Category,
    service: Service
} | null>(props.action);
const reactionSelected = ref<{
    card: Reaction,
    category: Category,
    service: Service
} | null>(props.reaction);

const hoverActionIcon = ref<boolean>(false);
const hoverReactionIcon = ref<boolean>(false);

const areaTitle = ref<string>(props.title);

const popupView = ref<'Extended' | 'Normal' | 'Minimal'>(props.view);

watch(() => props.view, (newView) => {
    popupView.value = newView;
});

watch(() => props.action, (newAction) => {
    actionSelected.value = newAction;
});

watch(() => props.reaction, (newReaction) => {
    reactionSelected.value = newReaction;
});

const emit = defineEmits(['remove-action', 'remove-reaction', 'create', 'change-title', 'change-view']);

watch(() => areaTitle.value, (newTitle) => {
    emit('change-title', newTitle);
});

function minimalView() {
    emit('change-view', 'Minimal');
}

function normalView() {
    emit('change-view', 'Normal');
}

function extendedView() {
    emit('change-view', 'Extended');
}

function removeAction() {
    hoverActionIcon.value = false;
    emit('remove-action');
}

function removeReaction() {
    hoverReactionIcon.value = false;
    emit('remove-reaction');
}

function resetPopup() {
    emit('remove-action');
    emit('remove-reaction');
    emit('change-title', '');
}

function redirectToAction() {
    if (!actionSelected.value) {
        console.error('No action selected');
        return;
    }
    router.push(`/service/${actionSelected.value.service.name}/category/${actionSelected.value.category.name}/action/${actionSelected.value.card.name}`);
    console.log('Redirecting to action:', actionSelected.value.card.display_name);
}

function redirectToReaction() {
    if (!reactionSelected.value) {
        console.error('No reaction selected');
        return;
    }
    router.push(`/service/${reactionSelected.value.service.name}/category/${reactionSelected.value.category.name}/reaction/${reactionSelected.value.card.name}`);
    console.log('Redirecting to reaction:', reactionSelected.value.card.display_name);
}

function create() {
    emit('create');
}
</script>
