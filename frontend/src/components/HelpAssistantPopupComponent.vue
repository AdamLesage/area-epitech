<template>
    <div
        @click.stop.prevent="displayPopup = false; displayedTip = null"
        class="fixed w-screen h-screen top-0 bg-black/40 !z-[100]"
        :class="{ 'select-none pointer-events-none !bg-transparent': !displayPopup }">
        <div
            v-if="!displayPopup"
            class="fixed z-50 p-2 half:p-1 rounded-full pointer-events-auto hover:cursor-pointer"
            :style="{ bottom: `${props.bottom}px`, backgroundColor: props.color, left: `${props.left}px` }"
            @click.stop="displayPopup = true">
            <Icon
                icon="material-symbols:help"
                class="text-white w-12 h-12 half:w-10 half:h-10"
                aria-label="Open Help Popup"
                role="button"
                tabindex="0" />
        </div>
        <div
            v-else
            class="fixed bottom-4 left-4 w-adjusted max-w-[30rem] h-[85vh] max-h-[29.5rem] rounded-xl shadow-2xl bg-white !z-[100] pointer-events-auto"
            role="dialog"
            aria-labelledby="help-popup-header"
            @click.stop>
            <header
                id="help-popup-header"
                class="bg-gray-300 rounded-t-xl px-4 py-2 flex justify-between items-center !z-[100]">
                <h1 class="text-gray-900 font-bold text-lg">Need Help?</h1>
                <button
                    class="rounded-full hover:bg-gray-400 flex items-center justify-center p-1 !z-[100]"
                    aria-label="Close Help Popup"
                    @click.stop="displayPopup = false">
                    <Icon icon="eva:close-outline" class="w-6 h-6 text-gray-900" />
                </button>
            </header>
  
            <main class="p-4 overflow-y-auto !z-[100]">
                <div v-if="!displayedTip">
                    <ul>
                        <li
                            v-for="tip in tips"
                            :key="tip.id"
                            class="flex gap-2 items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            @click.stop="displayedTip = tip"
                            role="button"
                            tabindex="0"
                            aria-label="View Tip Details">
                            <Icon :icon="tip.icon" class="w-6 h-6 text-gray-900" />
                            <p class="text-[#333] text-sm">{{ tip.title }}</p>
                        </li>
                    </ul>
                </div>
    
                <div v-else>
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2 pl-2">
                            <Icon :icon="displayedTip.icon" class="w-6 h-6 text-gray-900" />
                            <p class="text-[#333] text-sm font-medium">
                                {{ displayedTip.title }}
                            </p>
                        </div>
                        <button
                            class="flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                            @click.stop="displayedTip = null">
                            Back
                        </button>
                    </div>
                    <p class="text-[#333] text-sm mt-6 px-2">
                        {{ displayedTip.description }}
                    </p>
                </div>
            </main>
    
            <footer class="p-2 border-t border-gray-200 text-center absolute bottom-0 w-full flex justify-center flex-col items-center">
                <p class="text-[#333] text-sm">
                    Can't find what you need? Please contact us:
                </p>
                <div class="mt-2">
                    <p class="text-[#333] text-sm">
                        Email: contact.area.ownspace@gmail.com
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const displayPopup = ref<boolean>(false);
const displayedTip = ref<{
    id: number;
    icon: string;
    title: string;
    description: string; } | null>(null);

const props = defineProps<{
    bottom: number,
    left: number,
    color: string,
}>()

const tips = [
{
    id: 1,
    icon: "bx:bx-help-circle",
    title: "How Does an AREA Work?",
    description: `
        Our apps connects your favorite online services to create automated workflows. 
        You set up an Action (trigger) and a Reaction (response) to create an automation 
        workflow (AREA) that simplifies your tasks. For example, "When a new email arrives, save 
        the attachment to Google Drive."
    `,
},
{
    id: 2,
    icon: "bx:bx-play-circle",
    title: "What Is an Action?",
    description: `
        An Action is the event that triggers your workflow. It's the "if this happens" 
        part of an AREA. Examples include receiving a new email, uploading a file to Dropbox, 
        or posting a tweet. Actions start the automation process.
    `,
},
{
    id: 3,
    icon: "bx:bx-refresh",
    title: "What Is a Reaction?",
    description: `
        A Reaction is the task that gets executed when an Action occurs. 
        It's the "then that happens" part of an AREA. For example, "Send a notification" or 
        "Add the event to Google Calendar." Reactions complete the workflow.
    `,
},
{
    id: 4,
    icon: "bx:bx-cog",
    title: "How to Create an Action?",
    description: `
        To create an Action, choose a service and select the specific trigger event you 
        want to monitor. For example, pick Gmail and go to the Action Page: "New email received." 
        Click on the select this Action button to start or complete your AREA.
        Once a small popup appears you can click continue and proceed to the next step.
    `,
},
{
    id: 5,
    icon: "bx:bx-merge",
    title: "How to Create a Reaction?",
    description: `
        To create a Reaction, select a service and define the task you want to execute 
        when the Action is triggered. For instance, choose Google Drive and to the Reaction Page: 
        "Save the email attachment to a specific folder.". Click on the select this Reaction
        button to start or complete your AREA.
        Once a small popup appears you can click continue and proceed to the next step.
    `,
},
{
    id: 6,
    icon: "bx:bx-link",
    title: "Can I Link Any Action to Any Reaction?",
    description: `
        Yes! You can link any Action to any Reaction from different services to create 
        custom workflows. For example, you can link a new email Action from Gmail to a 
        save attachment Reaction in Google Drive. The possibilities are endless!
    `,
},
{
    id: 7,
    icon: "bx:bx-layer",
    title: "What Is a Service?",
    description: `
        A service is any platform, app, or tool that our apps supports to enable automations. 
        Examples include Github and Dropbox. You can combine Actions 
        and Reactions from different services to create powerful workflows.
        Although, some services may not contain both Actions and Reactions.
        You will need to connect your account to the service to use it in most cases.
    `,
},
{
    id: 8,
    icon: "bx:bx-rocket",
    title: "Getting Started with Us",
    description: `
        Start by picking a service and selecting an Action. Then, link it to a Reaction 
        from another service to complete your workflow. Save your AREA and watch the 
        automation in action!
        Happy automating!
    `,
}];
</script>

<style scoped>
.w-adjusted {
    width: calc(100% - 2rem);
}
</style>
