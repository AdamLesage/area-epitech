<template>
    <div :style="{ backgroundColor: '#333' }"
        class="flex flex-col justify-between before:bg-[url('@/assets/svg/Grid12.svg')] before:absolute before:w-full before:h-full overflow-hidden relative before:z-0"
        @click="workshopVisible = true"
        @wheel="handleScrollAttempt" v-if="!workshopVisible">
        <HelpAssistantPopupComponent :bottom="8" :left="8" color="#333" class="z-[60] mobile:hidden" />
        <HelpAssistantPopupComponent :bottom="108" :left="8" color="#333" class="z-[60] web:hidden" />
        <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
        <div class="flex flex-col justify-center items-center z-10 h-full">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon icon="mdi:hammer-screwdriver" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1
                        class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">
                        WORKSHOP</h1>
                    <h2 class="text-white text-xl font-medium text-right mobile:text-center mobile:text-base w-full pr-2">
                        Let's build your next AREA
                    </h2>
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center p-4 mobile:hidden z-10">
            <ArrowComponent direction="bottom" color="white" class="mobile:hidden hover:cursor-pointer" :animate="true" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden fixed bottom-0 bg-[#333] z-[10000]" />
    </div>
    <div v-else>
        <HelpAssistantPopupComponent :bottom="16" :left="16" color="#333" class="z-[60] mobile:hidden" />
        <HelpAssistantPopupComponent :bottom="116" :left="16" color="#333" class="z-[60] web:hidden" />
        <div class="flex flex-col items-center justify-between mobile:justify-center web:h-1/2 mobile:h-28 before:bg-[url('@/assets/svg/Grid12.svg')] before:absolute before:rotate-[12deg] before:w-[200%] before:h-[200%] before:top-[-50%] before:left-[-50%] overflow-hidden relative before:z-0"
            :style="{ backgroundColor: '#333' }">
            <ServiceNavComponent @back-button="handleBackButton" class="mobile:hidden z-10" />
            <div class="flex justify-center items-center p-4 z-10" v-if="scrollY == 0">
                <Icon icon="mdi:hammer-screwdriver" class="w-36 h-36 mobile:w-16 mobile:h-16 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold mobile:!text-[2.5rem] mobile:!leading-3">WORKSHOP</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">
                        Let's build your next AREA
                    </h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-10"
                :style="{ backgroundColor: '#333' }" v-else>
                <ServiceNavScrollComponent
                    title="WORKSHOP"
                    logo="mdi:hammer-screwdriver"
                    @back-button="handleBackButton"
                    :redirect="false"
                    class="bg-[#333]" />
            </div>
            <div />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden fixed bottom-0 bg-[#333] z-[10000]" />
        <div class="flex flex-col items-center">
            <div class="flex justify-between w-full mt-12 rounded-lg px-8 mobile:flex-col mobile:px-4">
                <div class="w-1/2 mobile:w-full flex justify-start gap-2 items-center">
                    <input type="text" class="w-full h-12 rounded-xl border-4 border-[#333] bg-[#333] text-white text-lg font-black text-start pl-4 placeholder:text-white/40"
                        v-model="title"
                        placeholder="Name your AREA" />
                    <div class="h-12 w-5 rounded-xl bg-[#333]" />
                    <div class="h-8 w-4 rounded-xl bg-[#333]" />
                </div>
                <div class="flex justify-end items-center w-1/2 mobile:w-fit gap-4 mobile:mt-4">
                    <button
                        aria-label="save-workshop-button"
                        class="w-36 h-12 rounded-xl bg-blue-500 text-white text-lg font-black hover:cursor-pointer shadow-lg"
                        @click="save">Save</button>
                    <button
                        aria-label="cancel-setup-workshop-button" 
                        class="w-36 h-12 rounded-xl bg-red-500 text-white text-lg font-black hover:cursor-pointer shadow-lg"
                        @click="cancelSetup">Cancel Setup</button>
                </div>
            </div>
            <main class="w-full flex justify-center items-start gap-8 h-full mt-12 mobile:mt-8 big:flex-col">
                <section id="action" class="h-full w-full flex flex-col items-center justify-center" v-if="action">
                    <div class="w-[75%] mobile:w-[90%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer relative"
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
                    <div class="flex justify-between w-[75%] mobile:w-[90%] px-4 items-center mt-4">
                        <h1 class="text-md font-black text-[#333]" v-if="!linkStatusAction">You need to connect to {{ action.service.name.charAt(0).toUpperCase() + action.service.name.slice(1) }} in order to have access to this action.</h1>
                        <h1 class="text-md font-black text-[#333]" v-else>You are correctly linked to {{ action.service.name.charAt(0).toUpperCase() + action.service.name.slice(1) }}.</h1>
                        <div class="flex w-full items-center justify-end">
                            <div
                                class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 transition-transform duration-300">
                                <div
                                    v-if="linkStatusAction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: action.service.color }"/>
                                <h1
                                    class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                    :style="{ color: action.service.color, textAlign: linkStatusAction ? 'left' : 'right' }">
                                    {{ linkStatusAction ? 'Linked' : 'Not Linked' }}
                                </h1>
                                <div
                                    v-if="!linkStatusAction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: action.service.color }"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-[75%] mobile:w-[90%] h-16 justify-between px-4 my-4 items-center bg-gray-300 rounded-xl hover:cursor-pointer"
                        @click="showActionOptions = !showActionOptions">
                        <h2 class="text-lg text-[#333] font-black select-none">Configuration</h2>
                        <Icon icon="material-symbols:hide-rounded" class="w-8 h-8 text-[#333]"
                            v-if="showActionOptions" />
                        <Icon icon="eva:expand-fill" class="w-8 h-8 text-[#333]"
                            v-else />
                    </div>
                    <div class="w-[75%] mobile:w-[90%] h-full mb-4" v-if="showActionOptions && action?.card.options.length != 0">
                        <div class="w-full h-full flex flex-col items-start justify-start gap-4 rounded-xl shadow-md p-4 pb-8">
                            <div v-for="(option) in action?.card.options" :key="option.name" class="flex flex-col gap-2 w-full">
                                <CustomInput
                                    :id="option.name"
                                    :key="option.name"
                                    :type="option.type"
                                    :name="option.display_name"
                                    :required="option.required"
                                    :value="actionOptions[option.name]"
                                    :action="true"
                                    :options="option.options"
                                    @change="(newValue) => handleChange(option.name, newValue, true)" />
                            </div>
                        </div>
                    </div>
                    <div class="w-[75%] mobile:w-[90%] h-full mb-4" v-if="showActionOptions && action?.card.options.length == 0">
                        <div class="w-full h-full flex flex-col items-start justify-center gap-4 rounded-xl shadow-md p-4 pb-4">
                            <h1 class="text-lg font-black text-[#333]">No configuration needed for this action.</h1>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start w-[75%] mobile:w-[90%] rounded-xl p-4 h-full shadow-lg"
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
                    <div class="flex w-[75%] mobile:w-[90%] h-16 justify-between px-4 my-4 items-center bg-gray-100 rounded-xl">
                        <h1 class="text-xl text-center w-full font-black text-[#333]">No action selected</h1>
                    </div>
                    <div v-if="!actionSearch.service" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center h-[40px]">
                            <h1 class="text-xl font-black text-[#333]">Select a Service for your Action</h1>
                        </div>
                        <div v-for="service in serviceStore.services.filter(service => service.categories.filter(category => category.actions.length > 0).length > 0)" :key="service.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] rounded-xl text-white hover:cursor-pointer shadow-lg"
                            @click="actionSearch.service = service"
                           >
                            <h1>-> {{ service.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="actionSearch.service && !actionSearch.category" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center">
                            <h1 class="text-xl font-black text-[#333]">Select a Category</h1>
                            <button
                                aria-label="change-service-action-workshop-button"
                                @click="actionSearch.service = null"
                                class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Change Service</button>
                        </div>
                        <div v-for="category in actionSearch.service.categories.filter(category => category.actions.length > 0)" :key="category.name" class="flex h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="actionSearch.category = category"
                           >
                            <h1>-> {{ category.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="actionSearch.service && actionSearch.category && !actionSearch.card" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center">
                            <h1 class="text-xl font-black text-[#333]">Select an Action</h1>
                            <div class="flex justify-end gap-2">
                                <button
                                    aria-label="change-category-action-workshop-button"
                                    @click="actionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Category</button>
                                <button
                                    aria-label="change-service2-action-workshop-button"
                                    @click="actionSearch.service = null; actionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Service</button>
                            </div>
                        </div>
                        <div v-for="card in actionSearch.category.actions" :key="card.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="actionSearch.card = card; changeAction()"
                           >
                            <h1>-> {{ card.display_name.toUpperCase() }}</h1>
                        </div>
                    </div>
                </section>
                <section id="bridge" class="h-full flex items-center justify-center mt-3 big:w-full">
                    <div class="flex flex-col items-center justify-center big:hidden">
                        <Icon icon="foundation:arrow-right" class="w-28 h-28 text-[#333]" />
                    </div>
                    <div class="flex-col items-center justify-center big:flex hidden">
                        <Icon icon="foundation:arrow-down" class="w-28 h-28 text-[#333]" />
                    </div>
                </section>
                <section id="reaction" class="h-full w-full flex flex-col items-center justify-center" v-if="reaction">
                    <div class="w-[75%] mobile:w-[90%] h-32 rounded-xl flex items-center justify-center gap-4 hover:cursor-pointer relative"
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
                    <div class="flex justify-between w-[75%] mobile:w-[90%] px-4 items-center mt-4">
                        <h1 class="text-md font-black text-[#333]" v-if="!linkStatusReaction">You need to connect to {{ reaction.service.name.charAt(0).toUpperCase() + reaction.service.name.slice(1) }} in order to have access to this reaction.</h1>
                        <h1 class="text-md font-black text-[#333]" v-else>You are correctly linked to {{ reaction.service.name.charAt(0).toUpperCase() + reaction.service.name.slice(1) }}.</h1>
                        <div class="flex w-full items-center justify-end">
                            <div
                                class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 transition-transform duration-300">
                                <div
                                    v-if="linkStatusReaction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: reaction.service.color }"/>
                                <h1
                                    class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                                    :style="{ color: reaction.service.color, textAlign: linkStatusReaction ? 'left' : 'right' }">
                                    {{ linkStatusReaction ? 'Linked' : 'Not Linked' }}
                                </h1>
                                <div
                                    v-if="!linkStatusReaction"
                                    class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                                    :style="{ backgroundColor: reaction.service.color }"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-[75%] mobile:w-[90%] h-16 justify-between px-4 my-4 items-center bg-gray-300 rounded-xl hover:cursor-pointer"
                        @click="showReactionOptions = !showReactionOptions">
                        <h2 class="text-lg text-[#333] font-black select-none">Configuration</h2>
                        <Icon icon="material-symbols:hide-rounded" class="w-8 h-8 text-[#333]"
                            v-if="showReactionOptions" />
                        <Icon icon="eva:expand-fill" class="w-8 h-8 text-[#333]"
                            v-else />
                    </div>
                    <div class="w-[75%] mobile:w-[90%] h-full mb-4" v-if="showReactionOptions && reaction?.card.options.length != 0">
                        <div class="w-full h-full flex flex-col items-start justify-start gap-4 rounded-xl shadow-md p-4 pb-8">
                            <div v-for="(option) in reaction?.card.options" :key="option.name" class="flex flex-col gap-2 w-full">
                                <CustomInput
                                    :id="option.name"
                                    :key="option.name"
                                    :type="option.type"
                                    :name="option.display_name"
                                    :required="option.required"
                                    :value="reactionOptions[option.name]"
                                    :action="false"
                                    :options="option.options"
                                    @change="(newValue) => handleChange(option.name, newValue, false)" />
                            </div>
                        </div>
                    </div>
                    <div class="w-[75%] mobile:w-[90%] h-full mb-4" v-if="showReactionOptions && reaction?.card.options.length == 0">
                        <div class="w-full h-full flex flex-col items-start justify-center gap-4 rounded-xl shadow-md p-4 pb-4">
                            <h1 class="text-lg font-black text-[#333]">No configuration needed for this reaction.</h1>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start w-[75%] mobile:w-[90%] rounded-xl p-4 h-full shadow-lg"
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
                    <div class="flex w-[75%] mobile:w-[90%] h-16 justify-between px-4 my-4 items-center bg-gray-100 rounded-xl">
                        <h1 class="text-xl text-center w-full font-black text-[#333]">No reaction selected</h1>
                    </div>
                    <div v-if="!reactionSearch.service" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center h-[40px]">
                            <h1 class="text-xl font-black text-[#333]">Select a Service for your reaction</h1>
                        </div>
                        <div v-for="service in serviceStore.services.filter(service => service.categories.filter(category => category.reactions.length > 0).length > 0)" :key="service.name" class="flex w-full h-16 justify-between px-4 my-4 items-center bg-[#333] rounded-xl text-white hover:cursor-pointer shadow-lg"
                            @click="reactionSearch.service = service"
                           >
                            <h1>-> {{ service.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="reactionSearch.service && !reactionSearch.category" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center">
                            <h1 class="text-xl font-black text-[#333]">Select a Category</h1>
                            <button
                                aria-label="change-service-reaction-workshop-button"
                                @click="reactionSearch.service = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Change Service</button>
                        </div>
                        <div v-for="category in reactionSearch.service.categories.filter(category => category.reactions.length > 0)" :key="category.name" class="flex h-16 justify-between px-4 my-4 items-center bg-[#333] text-white rounded-xl hover:cursor-pointer shadow-lg"
                            @click="reactionSearch.category = category"
                           >
                            <h1>-> {{ category.name.toUpperCase() }}</h1>
                        </div>
                    </div>
                    <div v-if="reactionSearch.service && reactionSearch.category && !reactionSearch.card" class="w-[75%] mobile:w-[90%]">
                        <div class="flex justify-between items-center">
                            <h1 class="text-xl font-black text-[#333]">Select a Reaction</h1>
                            <div class="flex justify-end gap-2">
                                <button
                                    aria-label="change-category-reaction-workshop-button"
                                    @click="reactionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Category</button>
                                <button
                                    aria-label="change-service2-reaction-workshop-button"
                                    @click="reactionSearch.service = null; reactionSearch.category = null" class="p-2 bg-[#333] rounded-md text-white hover:cursor-pointer">Service</button>
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
        <section id="help-section" class="flex flex-col items-center justify-center w-full pt-24 px-8 mobile:px-4">
            <div class="flex flex-col items-center justify-center w-full bg-white rounded-lg gap-12">
                <!-- Title -->
                <div class="flex items-center space-x-2">
                    <Icon icon="mdi:lightbulb-on-outline" class="text-2xl text-black" />
                    <h2 class="text-xl font-bold text-gray-800 underline decoration-2">How does the workshop work?</h2>
                </div>
                <!-- Visual Flow -->
                <div class="flex big:flex-col w-full items-center justify-around">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center justify-between w-1/4 min-w-[20rem] max-w-[30rem] mb-8 h-full text-center bg-gray-100 p-8 rounded-lg">
                        <div class="flex flex-col items-center justify-start gap-3">
                            <Icon icon="mdi:form-select" class="text-3xl text-black" />
                            <h3 class="text-xl font-bold text-gray-800">Step 1: Select an Action and a Reaction</h3>
                        </div>
                        <p class="text-gray-700">Choose an action and a reaction from the available services.</p>
                        <p class="text-gray-500">It could be either from this page or from the service pages directly.</p>
                    </div>
                    <!-- Arrow -->
                    <div class="flex justify-center">
                        <Icon icon="mdi:arrow-right" class="text-2xl text-gray-500 big:hidden flex -mr-12" />
                    </div>
                    <div class="flex justify-center">
                        <Icon icon="mdi:arrow-bottom" class="text-2xl text-gray-500 big:flex hidden mb-6" />
                    </div>
                    <!-- Step 2 -->
                    <div class="flex flex-col items-center justify-between w-1/4 min-w-[20rem] max-w-[30rem] mb-8 h-full text-center bg-gray-100 p-8 rounded-lg">
                        <div class="flex flex-col items-center justify-start gap-3">
                            <Icon icon="mdi:settings-outline" class="text-3xl text-black" />
                            <h3 class="text-xl font-bold text-gray-800">Step 2: Configure</h3>
                        </div>
                        <p class="text-gray-700">Click the "Configuration" button to set up your action and reaction.</p>
                        <p class="text-gray-500">The info you give in this part will be used as data for your AREA. Some data are optional.</p>
                    </div>
                    <!-- Arrow -->
                    <div class="flex justify-center">
                        <Icon icon="mdi:arrow-right" class="text-2xl text-gray-500 big:hidden flex -mr-12" />
                    </div>
                    <div class="flex justify-center">
                        <Icon icon="mdi:arrow-bottom" class="text-2xl text-gray-500 big:flex hidden mb-6" />
                    </div>
                    <!-- Step 3 -->
                    <div class="flex flex-col items-center justify-between w-1/4 min-w-[20rem] max-w-[30rem] mb-8 h-full text-center bg-gray-100 p-8 rounded-lg">
                        <div class="flex flex-col items-center justify-start gap-3">
                            <Icon icon="mdi:content-save-outline" class="text-3xl text-black" />
                            <h3 class="text-xl font-bold text-gray-800">Step 3: Save and Name</h3>
                        </div>
                        <p class="text-gray-700">Give your AREA a name and save it to complete the process.</p>
                        <p class="text-gray-500">Make sure to review all the details before saving.</p>
                    </div>
                </div>
            </div>
        </section>

        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
// Vue Lib
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Types
import { Action, Reaction, Category, Service } from '@/types/services';

// Stores
import { usePopupStore } from '@/stores/popup';
import { useServiceStore } from '@/stores/service';
import { useUserStore } from '@/stores/user';

// External Lib
import { Icon } from '@iconify/vue';
import Cookies from 'js-cookie';
import axios from 'axios';

// Components
import CustomInput from '@/components/CustomInput.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import { fetchUserAreas } from '@/logic/user';

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

function handleChange(optionName: string, newValue: string, action: boolean) {
    if (action) {
        actionOptions.value[optionName] = newValue;
        console.log(`Updated ${optionName}:`, newValue);
    } else {
        reactionOptions.value[optionName] = newValue;
        console.log(`Updated ${optionName}:`, newValue);
    }
}

function handleScrollAttempt(event: WheelEvent) {
    if (event.deltaY > 0) {
        workshopVisible.value = true;
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
        reactionData: reactionOptions.value,
        actionData: actionOptions.value,
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

    userStore.areas = [];
    store.action = null;
    store.reaction = null;
    store.title = '';
    store.actionData = {};
    store.reactionData = {};
    store.view = 'Normal';
    store.display = false;

    const areas = await fetchUserAreas(token);
    for (const area of areas) {
        userStore.addArea(area);
    }
}

function cancelSetup() {
    console.log('Setup cancelled.');
    router.go(-1);
    store.display = false;
    store.action = null;
    store.reaction = null;
    store.actionData = {};
    store.reactionData = {};
    store.view = 'Normal';
    store.title = '';
}

function handleBackButton() {
    console.log('Back button clicked');
    window.scrollTo(0, 0);
    router.go(-1);
    window.scrollTo(0, 0);
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

function redirectToAction() {
    console.log('Redirecting to action:', action.value?.card.display_name);
    window.scrollTo(0, 0);
    router.push(`/service/${action.value?.service.name}/category/${action.value?.category.name}/action/${action.value?.card.name}`);
    window.scrollTo(0, 0);
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

function redirectToReaction() {
    console.log('Redirecting to reaction:', reaction.value?.card.display_name);
    window.scrollTo(0, 0);
    router.push(`/service/${reaction.value?.service.name}/category/${reaction.value?.category.name}/reaction/${reaction.value?.card.name}`);
    window.scrollTo(0, 0);
    store.display = true;
    store.title = title.value;
    store.view = 'Minimal';
}

onMounted(() => {
    const user = userStore.user;
    scrollY.value = window.scrollY;

    if (!user) {
        console.error('User is not logged in.');
        return;
    }

    const linkedAccounts = user.linkedAccounts;

    for (const linkedAccount of linkedAccounts) {
        console.log('Linked account:', linkedAccount);
    }

    if (action.value && action.value.service) {
        linkStatusAction.value = user.linkedAccounts.some(linkedAccount => linkedAccount.serviceName === action.value?.service.name);
    }

    if (reaction.value && reaction.value.service) {
        linkStatusReaction.value = user.linkedAccounts.some(linkedAccount => linkedAccount.serviceName === reaction.value?.service.name);
    }
})
</script>
