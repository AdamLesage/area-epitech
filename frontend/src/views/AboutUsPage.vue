<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SignUpButton from '@/components/SignUpButton.vue';
import LoginButton from '@/components/LoginButton.vue';
import LogoComponent from '@/components/LogoComponent.vue';

const hover = ref(false);
const router = useRouter();

const goToHomePage = () => {
    router.push('/');
};
</script>

<template>
    <div class="bg-[#0A0A33]">
        <!-- Signup and login button -->
        <div class="w-full flex justify-end p-6 absolute top-0 right-0 space-x-6">
            <SignUpButton class="hover:cursor-pointer" :color="hover ? '#eee' : 'white'" @mouseover="hover = true"
                @mouseleave="hover = false" />
            <LoginButton class="hover:cursor-pointer" :color="hover ? '#eee' : 'white'" @mouseover="hover = true"
                @mouseleave="hover = false" />
        </div>

        <div class="bg-[#0A0A33] flex flex-col items-center px-8 min-h-screen justify-center">
            <!-- Logo -->
            <LogoComponent color="#80C4E9" class="w-80 h-80 mb-10" />
            <!-- Go back home button -->
            <button @click="goToHomePage"
                class="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                Go to Home Page
            </button>

            <!-- Short presentation -->
            <section class="text-center mt-8">
                <h2 class="text-2xl font-bold text-white mb-4">ABOUT US</h2>
                <p class="text-sm leading-6 text-gray-300 max-w-4xl mx-auto">
                    We are a team of 5 developers currently in Tek3 at Epitech, working on an exciting project called
                    <strong>AREA</strong> (Automated Reactive Event Application).
                    <br><br>
                    AREA is a web application designed to perform automated actions triggered by user-defined events.
                    Our stack includes Express.js for the backend and Vue.js for the frontend, allowing us to build a
                    dynamic and responsive system.
                    <br><br>
                    We have a timeline of 9 weeks to bring this project to life and make it a success! 🚀
                </p>
            </section>

            <!-- Timeline -->
            <section class="mt-16 w-full max-w-4xl mx-auto">
                <img src="@/assets/svg/Timeline.svg" alt="Project Timeline" class="w-3/4 mx-auto">
            </section>

            <!-- Who's -->
            <section class="mt-16 w-full flex justify-center flex-col gap-8 items-center">
                <h2 class="text-2xl font-bold text-white mb-8 text-center">WHO?</h2>
                <div class="flex flex-wrap w-3/4 gap-8 justify-center">
                    <!-- Team Cards -->
                    <div
                        class="bg-[#1A1A66] rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:scale-105">
                        <h3 class="font-bold text-white text-xl">Adam Lesage</h3>
                        <p class="text-sm text-gray-300 mt-2">Scrum Master<br>Ensures the project stays on track and
                            meets its goals.</p>
                    </div>

                    <div
                        class="bg-[#1A1A66] rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:scale-105">
                        <h3 class="font-bold text-white text-xl">Mathieu Mazeau</h3>
                        <p class="text-sm text-gray-300 mt-2">Front Developer and Designer<br>Creates and optimizes the front-end
                            experience.</p>
                    </div>

                    <div
                        class="bg-[#1A1A66] rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:scale-105">
                        <h3 class="font-bold text-white text-xl">Romain Chevallier</h3>
                        <p class="text-sm text-gray-300 mt-2">DevOps Engineer<br>Handles backend systems and automation.
                        </p>
                    </div>

                    <div
                        class="bg-[#1A1A66] rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:scale-105">
                        <h3 class="font-bold text-white text-xl">Victor Hritsea</h3>
                        <p class="text-sm text-gray-300 mt-2">Backend Developer<br>Builds and manages the API backend.
                        </p>
                    </div>

                    <div
                        class="bg-[#1A1A66] rounded-2xl p-6 text-center shadow-lg transform transition duration-500 hover:scale-105">
                        <h3 class="font-bold text-white text-xl">Tugdual de Reviers</h3>
                        <p class="text-sm text-gray-300 mt-2">Front Developer<br>Creates and optimizes the front-end
                            experience.</p>
                    </div>
                </div>
            </section>

        </div>
        <!-- Space at the bot -->
        <div class="h-16 bg-[#0A0A33]"></div>
    </div>
</template>

<style scoped></style>