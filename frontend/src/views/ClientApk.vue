<template>
    <div class="bg-home !h-full relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('@/assets/img/Grid2.png')] w-full h-full bg-repeat bg-center opacity-5 z-0"></div>

        <!-- Navigation Bar -->
        <nav class="flex items-center w-full justify-between pl-8 pr-4 py-4 fixed bg-home z-10 mobile:flex-col">
            <div class="w-full h-[55px] items-center flex">
                <h1 class="w-1/2 mobile:w-full text-3xl font-black tracking-wide cursor-pointer text-home-text"
                    @click="goHome">AREA</h1>
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start gap-4 -ml-3" v-if="!user">
                <LoginButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
                <SignUpButtonText
                    class="hover:cursor-pointer"
                    color="white"
                    text-color="#4C4CDC" />
            </div>
            <div class="w-1/2 mobile:w-full flex justify-end mobile:justify-start -ml-3" v-else>
                <DashboardButtonText
                    class="hover:cursor-pointer"
                    color="#4C4CDC"
                    text-color="white" />
            </div>
        </nav>

        <!-- Mobile App Content -->
        <div class="flex flex-col items-center justify-center h-[100vh] z-[2] px-4">
            <h1 class="text-5xl mobile:text-2xl font-extrabold text-white mb-4">Mobile App downloading...</h1>
            <p class="text-sm text-home-text-light mb-6 text-center">
                * Please wait for the download to finish.
            </p>
            <button aria-label="mobile-app-back-button" @click="goHome" class="btn btn-primary px-12 py-4 text-white bg-home-div rounded-lg transition hover:cursor-pointer z-10">
                Back
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const user = ref(userStore.user);

function goHome() {
    router.push('/');
}

onMounted(async () => {
    try {
        // Define the response type explicitly as AxiosResponse<Blob>
        const response = await axios.get<Blob>("/apk/app-release.apk", {
        responseType: "blob",  // Specify that we're expecting a Blob in the response
        });

        // Create a Blob from the response data
        const blob: Blob = new Blob([response.data], {
            type: "application/vnd.android.package-archive", // Correct MIME type for APK
        });

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);  // Create an object URL for the Blob
        link.download = "app-release.apk";  // Specify the file name for the download
        link.click();  // Programmatically click the link to trigger the download

        // Clean up the created object URL
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error downloading the file", error);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    user.value = userStore.user;
});
</script>
