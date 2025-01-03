<template>
    <!-- First Page -->
    <div
        :style="{ backgroundColor: color }"
        class="flex flex-col justify-between"
        @click="openServicePage"
        @wheel="handleScrollAttempt"
        v-if="isHeroVisible">
        <ServiceNavComponent
            @back-button="handleBackButton"
            class="mobile:hidden" />
        <HelpAssistantPopupComponent :bottom="56" :left="8" :color="color" />
        <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" class="web:hidden p-4" />
        <div class="flex flex-col justify-center items-center">
            <div class="flex justify-center items-center p-4 web:flex-row mobile:flex-col">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white web:text-[6rem] mobile:text-[3rem] web:leading-[5rem] mobile:leading-[2.5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
                </div>
            </div>
            <div
                class="border-4 border-auth-neutral w-[300px] h-[90px] rounded-full bg-white flex justify-between items-center px-4 cursor-pointer transition-transform duration-300 mobile:hidden"
                @click.stop="handleClick">
                <div
                    v-if="isCircleFirst"
                    class="rounded-full w-[60px] h-[60px] transition-all duration-500"
                    :style="{ backgroundColor: color }"
                />
                <h1
                    class="text-xl font-semibold w-1/2 transition-all duration-500 select-none"
                    :style="{ color: color, textAlign: isCircleFirst ? 'left' : 'right' }"
                >
                    {{ isCircleFirst ? 'Activate' : 'Deactivate' }}
                </h1>
                <div
                    v-if="!isCircleFirst"
                    class="rounded-full w-[60px] h-[60px] transition-all duration-500"
                    :style="{ backgroundColor: color }"
                />
            </div>
        </div>
        <div class="flex flex-col web:hidden gap-2">
            <h2 class="text-white text-xl font-bold text-center w-full pr-2">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
            <div class="flex flex-row gap-2 items-center justify-center">
                <button class="rounded-full py-2 px-6 bg-white w-32">
                    <h1 class="font-semibold">Activate</h1>
                </button>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer" />
            </div>
        </div>
        <div class="flex justify-between items-center p-4 mobile:hidden">
            <RateComponent :rate="rate" :reviews="reviews" color="white" textcolor="white" class="w-1/3" />
            <ArrowComponent
                direction="bottom"
                color="white"
                :animate="true"
                class="w-1/3" />
            <SaveComponent :saves="saves" color="white" textcolor="white" class="w-1/3 flex justify-end" />
        </div>
        <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden" />
    </div>
    <!-- Second Page -->
    <div
        @wheel="handleScrollAttemptSecondPage"
        v-else>
        <HelpAssistantPopupComponent :bottom="16" :left="16" :color="color" />
        <div class="flex flex-col items-center justify-between web:h-1/2 mobile:h-full"
            :style="{ backgroundColor: color }">
            <ServiceNavComponent
                @back-button="handleBackButton"
                class="mobile:hidden" />
            <div class="flex justify-center items-center p-4 mobile:hidden" v-if="scrollY == 0">
                <Icon :icon="logo" class="w-36 h-36 text-white" />
                <div class="flex flex-col justify-end items-center p-4">
                    <h1 class="text-white text-[6rem] leading-[5rem] font-bold">{{ nameCapitalized }}</h1>
                    <h2 class="text-white text-xl font-medium text-right w-full pr-2">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
                </div>
            </div>
            <div class="fixed top-0 flex justify-center items-center w-full mobile:hidden z-50"
                :style="{ backgroundColor: color }"
                v-else>
                <ServiceNavScrollComponent @back-button="handleBackButton"
                    :logo="logo" :title="nameCapitalized"
                    :redirect="true" />
            </div>
            <div class="flex justify-between items-center w-full web:hidden">
                <div class="flex web:justify-center items-center p-4 w-full mobile:justify-start">
                    <Icon :icon="logo" class="web:w-36 mobile:w-[48px] web:h-36 mobile:h-[48px] text-white" />
                    <div class="flex flex-col justify-end items-center web:p-4 mobile:p-2">
                        <h1 class="text-white web:text-[6rem] mobile:text-[2rem] web:leading-[5rem] mobile:leading-[1.75rem] font-bold">{{ nameCapitalized }}</h1>
                        <h2 class="text-white text-xl font-medium text-right w-full pr-2 mobile:hidden">{{ nbActions }} Actions / {{ nbReactions }} Reactions</h2>
                    </div>
                </div>
                <Icon icon="material-symbols:bookmark-outline" class="w-8 h-8 text-white hover:cursor-pointer mr-4" />
            </div>
            <div class="flex w-full justify-center web:hidden m-4">
                <button class="rounded-full py-2 px-6 bg-white w-32">
                    <h1 class="font-semibold">Activate</h1>
                </button>
            </div>
            <div class="flex flex-col items-center justify-start w-full p-4 web:hidden gap-4 overflow-y-scroll"
                @wheel.stop
                v-if="service">
                <div v-for="category in service.categories" :key="category.name">
                    <h1 class="text-white bg-black text-xl font-bold p-2 rounded-full w-full text-center">{{ category.name }}</h1>
                </div>
            </div>
            <div class="mobile:hidden" />
            <MobileServiceNavComponent @back-button="handleBackButton" class="web:hidden" />
        </div>
        <div class="flex justify-between items-center p-8 mobile:hidden web:hidden">
            <RateComponent :rate="rate" :reviews="reviews" :color="color" textcolor="black" class="w-1/3" />
            <div class="w-1/3 flex justify-center">
                <div
                    class="border-4 border-auth-neutral w-[300px] h-[90px] rounded-full bg-white flex justify-between items-center px-4 cursor-pointer transition-transform duration-300"
                    @click.stop="handleClick">
                    <div
                        v-if="isCircleFirst"
                        class="rounded-full w-[60px] h-[60px] transition-all duration-500"
                        :style="{ backgroundColor: color }"
                    />
                    <h1
                        class="text-xl font-semibold w-1/2 transition-all duration-500 select-none"
                        :style="{ color: color, textAlign: isCircleFirst ? 'left' : 'right' }"
                    >
                        {{ isCircleFirst ? 'Activate' : 'Deactivate' }}
                    </h1>
                    <div
                        v-if="!isCircleFirst"
                        class="rounded-full w-[60px] h-[60px] transition-all duration-500"
                        :style="{ backgroundColor: color }"
                    />
                </div>
            </div>
            <SaveComponent :saves="saves" :color="color" textcolor="black" class="w-1/3 flex justify-end" />
        </div>
        <div class="flex justify-center w-full gap-8 mt-6">
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'overview' ? 'underline' : ''"
                :style="{ color: '#333', textDecorationColor: '#333' }"
                @click="switchView('overview')">
                Overview
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'categories' ? 'underline' : ''"
                :style="{ color: '#333', textDecorationColor: '#333' }"
                @click="switchView('categories')">
                Categories
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'actions' ? 'underline' : ''"
                :style="{ color: '#333', textDecorationColor: '#333' }"
                @click="switchView('actions')">
                Actions
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'reactions' ? 'underline' : ''"
                :style="{ color: '#333', textDecorationColor: '#333' }"
                @click="switchView('reactions')">
                Reactions
            </button>
            <button class="text-lg font-black hover:cursor-pointer decoration-2 hover:underline"
                :class="view === 'details' ? 'underline' : ''"
                :style="{ color: '#333', textDecorationColor: '#333' }"
                @click="switchView('details')">
                Details
            </button>
        </div>

        <!-- Categories -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'categories'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: '#333' }">
                <h1 class="text-3xl font-extrabold text-white mb-2 hover:underline decoration-2 hover:cursor-pointer" @click="redirectToCategory(categorySelected!.name)">Category: {{ categorySelected?.display_name }}</h1>
            </div>

            <div class="relative w-[66.75rem] h-[30rem] overflow-hidden rounded-lg mt-6">
                <div class="flex transition-transform duration-500 ease-in-out relative"
                    :style="{ transform: `translateX(-${currentSlide * 100 / service.categories.length}%)`, width: `${service.categories.length * 66.75}rem` }">
                    <div v-for="(category) in service.categories"
                        :key="category.name"
                        class="flex justify-center flex-col h-[30rem] items-center w-[66.75rem] hover:cursor-pointer"
                        :style="{ backgroundColor: service!.color }"
                        @click="redirectToCategory(category.name)">
                        <div class="flex items-center justify-center gap-2 z-10">
                            <h1 class="text-xl font-bold text-white hover:underline decoration-2">{{ category.display_name }}</h1>
                            <Icon :icon="service.icon" class="text-white w-8 h-8" />
                        </div>
                        <p class="z-10 text-white/75">{{ category.actions.length }} Action{{ category.actions.length > 1 ? 's' : '' }}</p>
                        <p class="z-10 text-white/75">{{ category.reactions.length }} Reaction{{ category.reactions.length > 1 ? 's' : '' }}</p>
                    </div>
                </div>
                <button
                    class="absolute h-full top-0 left-0 p-2 z-20 before:hover:bg-black/5 before:absolute before:top-0 before:left-0 before:h-full before:w-full"
                    v-if="service.categories.length > 1"
                    :style="{ backgroundColor: service!.color }"
                    @click="prevSlide">
                    <ArrowComponent
                        direction="left"
                        color="white"
                        :animate="false"
                        class="w-1/3" />
                </button>
                <button
                    class="absolute h-full top-0 right-0 p-2 z-20 before:hover:bg-black/5 before:absolute before:top-0 before:left-0 before:h-full before:w-full"
                    v-if="service.categories.length > 1"
                    :style="{ backgroundColor: service!.color }"
                    @click="nextSlide">
                    <ArrowComponent
                        direction="right"
                        color="white"
                        :animate="false"
                        class="w-1/3" />
                </button>
            </div>

            <div class="flex justify-center w-[66.75rem] gap-6 mt-12" v-if="categorySelected">
                <div class="flex items-center gap-6" v-if="allItemsCategorySelected.length != 0">
                    <div class="flex flex-wrap gap-6">
                        <AREAInfoComponent
                            v-for="item in allItemsCategorySelected"
                            :key="item.name"
                            :object="item"
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(categorySelected.name, item.name)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'actions'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="switchView('overview')"/>
                <h1 class="text-3xl font-extrabold text-white mb-2">Actions: {{ nbActions }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Actions are triggered by events on the platform. They are retrieved automatically.<br />
                    Click on an action card to see more details.
                </p>
            </div>
            <div v-for="(category) in service.categories" :key="category.name"
                class="flex justify-center w-[66.75rem]">
                <div class="flex flex-col items-center w-full gap-4 mt-6" v-if="category.actions.length != 0">
                    <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1" :style="{ color: '#333' }">{{ category.display_name }}</h1>
                    <div class="flex flex-wrap gap-6 w-full">
                        <AREAInfoComponent
                            v-for="action in category.actions"
                            :key="action.name"
                            :object="action"
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(category.name, action.name)"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reactions -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'reactions'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="switchView('overview')"/>
                <h1 class="text-3xl font-extrabold text-white mb-2">Reactions: {{ nbReactions }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Reactions are triggered by actions on the platform. They are executed automatically.<br />
                    Click on a reaction card to see more details.
                </p>
            </div>
            <div v-for="(category) in service.categories" :key="category.name"
                class="flex justify-center w-[66.75rem]">
                <div class="flex flex-col items-center w-full gap-4 mt-6" v-if="category.reactions.length != 0">
                    <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1" :style="{ color: '#333' }">{{ category.display_name }}</h1>
                    <div class="flex flex-wrap gap-6 w-full">
                        <AREAInfoComponent
                            v-for="reaction in category.reactions"
                            :key="reaction.name"
                            :object="reaction"
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(category.name, reaction.name)"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- Overview -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'overview'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="switchView('overview')"/>
                <h1 class="text-3xl font-extrabold text-white mb-2">Overview: {{ service.name.charAt(0).toUpperCase() + service.name.slice(1) }}</h1>
                <p class="text-lg text-white/80 text-center">
                    Here is an overview of the {{ service.name }} service.
                </p>
            </div>

            <div class="flex justify-between w-[66.75rem] my-12">
                <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" :color="service.color" textcolor="#6b7280" class="w-full"/>
                <div class="flex w-full items-center justify-center">
                    <div
                        class="border-4 border-auth-neutral w-[200px] h-[50px] rounded-full bg-white flex justify-between items-center px-2 cursor-pointer transition-transform duration-300"
                        @click.stop="handleClick">
                        <div
                            v-if="isCircleFirst"
                            class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                            :style="{ backgroundColor: color }" />
                        <h1
                            class="text-xl font-semibold transition-all duration-500 select-none w-[146px] flex justify-center"
                            :style="{ color: color, textAlign: isCircleFirst ? 'left' : 'right' }">
                            {{ isCircleFirst ? 'Not Linked' : 'Linked' }}
                        </h1>
                        <div
                            v-if="!isCircleFirst"
                            class="rounded-full w-[30px] h-[30px] transition-all duration-500"
                            :style="{ backgroundColor: color }" />
                    </div>
                </div>
                <SaveComponent :saves="service.saves" :color="service.color" textcolor="#6b7280" class="w-full flex justify-end"/>
            </div>

            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4 mt-12"
                :style="{ backgroundColor: '#333' }">
                <h1 id="categories" class="text-3xl font-extrabold text-white mb-2"><span class="text-white/75 hover:cursor-pointer" @click="switchView('categories')">#</span> Categories</h1>
            </div>
            <div class="relative w-[66.75rem] h-[30rem] overflow-hidden rounded-lg mt-6">
                <div class="flex transition-transform duration-500 ease-in-out"
                    :style="{ transform: `translateX(-${currentSlide * 100 / service.categories.length}%)`, width: `${service.categories.length * 66.75}rem` }">
                    <div v-for="(category) in service.categories"
                        :key="category.name"
                        class="flex justify-center flex-col h-[30rem] items-center w-[66.75rem] hover:cursor-pointer"
                        :style="{ backgroundColor: service!.color }"
                        @click="redirectToCategory(category.name)">
                        <div class="flex items-center justify-center gap-2 z-10">
                            <h1 class="text-xl font-bold text-white hover:underline decoration-2">{{ category.display_name }}</h1>
                            <Icon :icon="service.icon" class="text-white w-8 h-8" />
                        </div>
                        <p class="z-10 text-white/75">{{ category.actions.length }} Action{{ category.actions.length > 1 ? 's' : '' }}</p>
                        <p class="z-10 text-white/75">{{ category.reactions.length }} Reaction{{ category.reactions.length > 1 ? 's' : '' }}</p>
                    </div>
                </div>
                <button
                    class="absolute h-full top-0 left-0 p-2 z-20 before:hover:bg-black/5 before:absolute before:top-0 before:left-0 before:h-full before:w-full"
                    v-if="service.categories.length > 1"
                    :style="{ backgroundColor: service!.color }"
                    @click="prevSlide">
                    <ArrowComponent
                        direction="left"
                        color="white"
                        :animate="false"
                        class="w-1/3" />
                </button>
                <button
                    class="absolute h-full top-0 right-0 p-2 z-20 before:hover:bg-black/5 before:absolute before:top-0 before:left-0 before:h-full before:w-full"
                    v-if="service.categories.length > 1"
                    :style="{ backgroundColor: service!.color }"
                    @click="nextSlide">
                    <ArrowComponent
                        direction="right"
                        color="white"
                        :animate="false"
                        class="w-1/3" />
                </button>
            </div>
            <div class="flex justify-center w-[66.75rem] gap-6 mt-12" v-if="categorySelected">
                <div class="flex items-center gap-6" v-if="allItemsCategorySelected.length != 0">
                    <div class="flex flex-wrap gap-6">
                        <AREAInfoComponent
                            v-for="item in allItemsCategorySelected"
                            :key="item.name"
                            :object="item"
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(categorySelected.name, item.name)"/>
                    </div>
                </div>
            </div>

            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4 mt-24"
                :style="{ backgroundColor: '#333' }">
                <h1 id="all-aps" class="text-3xl font-extrabold text-white mb-2">All apps</h1>
            </div>
            <div class="flex justify-between w-[66.75rem] mt-6 relative">
                <div class="flex gap-2">
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Actions' ? service!.color : '#fff',
                            color: modeSelected == 'Actions' ? 'white' : '#333'
                         }"
                        @click="modeSelected = 'Actions'">
                        <h1 class="text-lg font-semibold">Actions</h1>
                    </button>
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Reactions' ? service!.color : '#fff',
                            color: modeSelected == 'Reactions' ? 'white' : '#333' }"
                        @click="modeSelected = 'Reactions'">
                        <h1 class="text-lg font-semibold">Reactions</h1>
                    </button>
                    <button class="p-2 rounded-full px-4"
                        :style="{ backgroundColor: modeSelected == 'Both' ? service!.color : '#fff',
                            color: modeSelected == 'Both' ? 'white' : '#333' }"
                        @click="modeSelected = 'Both'">
                        <h1 class="text-lg font-semibold">Both</h1>
                    </button>
                </div>
                <input type="search" v-model="search" class="border-2 border-[#999] pl-4 pr-10 rounded-md mr-[2px]" placeholder="Search . . .">
                <Icon class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" icon="akar-icons:search" />
            </div>
            <div
                class="flex justify-center w-[66.75rem] gap-6 mt-6">
                <div class="flex items-center gap-4 mt-6">
                    <div class="flex flex-wrap gap-6 w-full" v-if="sortedCategories.length > 0">
                        <AREAInfoComponent
                            v-for="item in sortedCategories"
                            :key="item.name"
                            :object="item"
                            :color="service.color"
                            class="hover:cursor-pointer"
                            @click="redirectToCard(null, item.name)" />
                    </div>
                    <div class="flex flex-wrap gap-6 w-full" v-else>
                        <h1 class="text-2xl font-black text-start w-full rounded-lg pl-1 text-[#333]">
                            No results found</h1>
                    </div>
                </div>
            </div>
        </div>

        <!-- Details -->
        <div class="flex flex-wrap justify-center mobile:hidden w-full items-center flex-col mt-12"
            v-if="service && view === 'details'">
            <div class="flex flex-col justify-center items-center w-[66.75rem] p-6 rounded-lg shadow-md gap-4"
                :style="{ backgroundColor: service.color }">
                <Icon :icon="service.icon" class="w-24 h-24 text-white hover:cursor-pointer" @click="switchView('overview')"/>
                <h1 class="text-3xl font-extrabold text-white">{{ nameCapitalized }}</h1>
                <p class="text-lg text-white/80 text-center hover:cursor-pointer" @click="copyColor">
                    color: {{ service.color }}
                </p>
            </div>
            <div class="flex flex-col justify-center items-start w-[66.75rem] p-6 gap-4">
                <div class="flex justify-between w-full">
                    <RateComponent :rate="service.reviews.rate" :reviews="service.reviews.count" :color="service.color" textcolor="#6b7280"/>
                    <SaveComponent :saves="service.saves" :color="service.color" textcolor="#6b7280"/>
                </div>
                <h1 class="text-xl font-black text-start w-full rounded-lg text-[#333] mt-4">Categories:</h1>
                <div class="flex justify-start flex-wrap w-full gap-4">
                    <div class="gap-4 px-4 py-1 rounded-md hover:cursor-pointer ml-4" :style="{ backgroundColor: service.color }" v-for="category in service.categories" :key="category.name" @click="redirectToCategory(category.name)">
                        <h1 class="text-lg font-semibold text-start w-full rounded-lg text-white">{{ category.display_name }}</h1>
                    </div>
                </div>
                <h1 id="having-trouble" class="text-xl font-black text-start w-full rounded-lg pl-1 text-[#333] mt-12 mb-4"><span class="hover:cursor-pointer text-gray-500" @click="scrollToHavingTrouble">#</span> Having trouble ?</h1>
                <!-- Trouble advices -->
                <!-- Verify your connected to the service, check the different service actions and reactions card description -->
                <div class="flex flex-col w-full gap-4">
                    <div class="flex justify-start gap-4 items-center ml-7 p-1 hover:bg-gray-50 rounded-lg">
                        <span class="h-12 w-1.5 rounded-md" :style="{ backgroundColor: service.color }" />
                        <div class="flex flex-col w-full">
                            <h1 class="text-lg font-semibold text-start w-full rounded-lg text-[#333]">Verify your connected to the service</h1>
                            <p class="text-lg text-start w-full text-gray-500">Make sure you are connected to the service. If not, please connect to the service.</p>
                        </div>
                    </div>
                    <div class="flex justify-start gap-4 items-center ml-7 p-1 hover:bg-gray-50 rounded-lg">
                        <span class="h-16 w-1.5 rounded-md" :style="{ backgroundColor: service.color }" />
                        <div class="flex flex-col w-full">
                            <h1 class="text-lg font-semibold text-start w-full rounded-lg text-gray-900">Check the different service action and reaction cards description</h1>
                            <p class="text-lg text-start w-full text-gray-500">Make sure you understand the different actions and reactions card description. If not, please read the card description.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServiceStore } from '@/stores/service';
import { Category } from '@/types/services';

import ServiceNavComponent from '@/components/ServiceNavComponent.vue';
import MobileServiceNavComponent from '@/components/MobileServiceNavComponent.vue';
import ServiceNavScrollComponent from '@/components/ServiceNavScrollComponent.vue';
import RateComponent from '@/components/RateComponent.vue';
import SaveComponent from '@/components/SaveComponent.vue';
import ArrowComponent from '@/components/ArrowComponent.vue';
import AREAInfoComponent from '@/components/AREAInfoComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import HelpAssistantPopupComponent from '@/components/HelpAssistantPopupComponent.vue';

import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = ref(userStore.user);

const route = useRoute();
const router = useRouter();

const serviceId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const noHeader: boolean = route.query.header === 'false';

const store = useServiceStore();
console.log('Service ID:', serviceId);
const service = store.services.find(service => service.name === serviceId) || null;
console.log('Service:', service);

if (!service) {
    console.error('Service not found');
    router.push('/dashboard');
}

type Mode = 'Actions' | 'Reactions' | 'Both';

const color = ref<string>(service!.color);
const name = ref<string>(service!.name);
const logo = ref<string>(service!.icon);
const rate = ref<number>(service!.reviews.rate);
const reviews = ref<number>(service!.reviews.count);
const saves = ref<number>(service!.saves);
const isActivated = ref<boolean>(true);
const nbActions = ref<number>(0);
const nbReactions = ref<number>(0);
const currentSlide = ref<number>(0);
const categorySelected = ref<Category | null>(null);
const modeSelected = ref<Mode>('Both');
const search = ref<string>('');

const sortedCategories = computed(() => {
    const allCategories = [];
    for (const category of service!.categories) {
        if (modeSelected.value === 'Actions' && category.actions) {
            const filteredActions = category.actions.filter(action => action.name.toLowerCase().includes(search.value.toLowerCase()) || action.description.toLowerCase().includes(search.value.toLowerCase()));
            allCategories.push(...filteredActions);
        } else if (modeSelected.value === 'Reactions' && category.reactions) {
            const filteredReactions = category.reactions.filter(reaction => reaction.name.toLowerCase().includes(search.value.toLowerCase()) || reaction.description.toLowerCase().includes(search.value.toLowerCase()));
            allCategories.push(...filteredReactions);
        } else {
            const filteredActions = [];
            const filteredReactions = [];
            if (category.actions) {
                filteredActions.push(...category.actions.filter(action => action.name.toLowerCase().includes(search.value.toLowerCase()) || action.description.toLowerCase().includes(search.value.toLowerCase())));
            }
            if (category.reactions) {
                filteredReactions.push(...category.reactions.filter(reaction => reaction.name.toLowerCase().includes(search.value.toLowerCase()) || reaction.description.toLowerCase().includes(search.value.toLowerCase())));
            }
            allCategories.push(...filteredActions, ...filteredReactions);
        }
    }
    return allCategories;
});

const allItemsCategorySelected = computed(() => {
    if (!categorySelected.value) return [];
    return [...categorySelected.value.actions, ...categorySelected.value.reactions];
})

function prevSlide() {
    currentSlide.value = (currentSlide.value - 1 + service!.categories.length) % service!.categories.length;
    categorySelected.value = service!.categories[currentSlide.value];
}

function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % service!.categories.length;
    categorySelected.value = service!.categories[currentSlide.value];
}

const view = ref<string>('overview');

function switchView(newView: string) {
    console.log('Switching view to:', newView);
    view.value = newView;
}

if (service && service.categories) {
    categorySelected.value = service.categories[0];
    for (const category of service.categories) {
        console.log('Category:', category);
        nbActions.value += category.actions.length;
        nbReactions.value += category.reactions.length;
    }
} else {
    console.error('No categories found in service');
}

const nameCapitalized = ref(name.value.toUpperCase());
const isHeroVisible = ref(!noHeader);

const isCircleFirst = ref(true);
const scrollY = ref(0);

window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;
})

function handleClick() {
    isActivated.value = !isActivated.value;
    isCircleFirst.value = !isCircleFirst.value;
}

function openServicePage() {
    console.log('Service page opened');
    isHeroVisible.value = false;
}

function handleBackButton() {
    console.log('Back button clicked on first page');
    window.scrollTo(0, 0);
    if (!user.value) {
        router.push('/');
    } else {
        router.push('/dashboard');
    }
}

function redirectToCategory(categoryName: string) {
    console.log('Redirecting to category:', categoryName);
    const category = service!.categories.find(category => category.name === categoryName);
    if (category) {
        window.scrollTo(0, 0);
        router.push(`/service/${serviceId}/category/${category.name}`);
        window.scrollTo(0, 0);
    }
}

function redirectToCard(categoryName: string | null, cardName: string) {
    let category = null;
    if (!categoryName) {
        category = service!.categories.find(category => category.actions.find(action => action.name === cardName) || category.reactions.find(reaction => reaction.name === cardName));
    } else
        category = service!.categories.find(category => category.name === categoryName);
    console.log('Redirecting to card:', cardName, ' from category:', categoryName);
    if (category) {
        const card = category.actions.find(action => action.name === cardName) || category.reactions.find(reaction => reaction.name === cardName);
        const isAction = category.actions.find(action => action.name === cardName) ? true : false;
        if (card) {
            window.scrollTo(0, 0);
            if (isAction)
                router.push(`/service/${serviceId}/category/${category.name}/action/${card.name}`);
            else
                router.push(`/service/${serviceId}/category/${category.name}/reaction/${card.name}`);
        }
    }
}

function handleScrollAttempt(event: WheelEvent) {
    if (event.deltaY > 0) {
        openServicePage();
    }
}

function handleScrollAttemptSecondPage(event: WheelEvent) {
    if (event.deltaY < 0 && scrollY.value === 0) {
        isHeroVisible.value = true;
    }
}

function scrollToHavingTrouble() {
    const element = document.getElementById('having-trouble');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyColor() {
    navigator.clipboard.writeText(service!.color);
    alert('Color copied to clipboard');
}
</script>
