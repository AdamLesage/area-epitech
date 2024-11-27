<template>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(59, 89, 152); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="facebook-f"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(85, 172, 238); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="twitter"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(221, 75, 57); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="google"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(172, 43, 172); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="instagram"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(0, 130, 202); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="linkedin-in"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(198, 17, 24); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="pinterest"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(76, 117, 163); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="vk"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(255, 172, 68); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="stack-overflow"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(237, 48, 47); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="youtube"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(72, 20, 73); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="slack-hash"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(51, 51, 51); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="github"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(236, 74, 137); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="dribbble"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(255, 69, 0); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="reddit-alien"></MDBIcon>
    </MDBBtn>
    <MDBBtn tag="a" color="primary" href="#!" style="background-color: rgb(37, 211, 102); font-size: 1.5rem; padding: 1rem 2rem;">
        <MDBIcon iconStyle="fab" icon="whatsapp"></MDBIcon>
    </MDBBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MDBBtn, MDBIcon } from 'mdb-vue-ui-kit';

function handleSocialClick(platform: string) {
    console.log(`Connect with ${platform}`);
}
</script>

<style scoped></style>
