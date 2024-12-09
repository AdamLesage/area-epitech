<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
    rate: number,
    reviews: number,
    color: string,
    textcolor: string,
}>()

const rateFloor = Math.floor(props.rate);
function formatNumberWithSuffix(value: number): string {
    const suffixes = ["", "k", "m", "b"];
    let suffixIndex = 0;

    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
    }

    const formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return `${formattedValue}${suffixes[suffixIndex]}`;
}

const reviewsWithSuffix = formatNumberWithSuffix(props.reviews);
</script>

<template>
    <div class="flex items-center gap-2">
        <div class="flex items-center justify-start -space-x-1">
            <Icon
                icon="material-symbols:star"
                class="w-6 h-6"
                :style="{ color: props.color }"
                v-for="index in rateFloor"
                :key="'filled-' + index"
            />
            <Icon
                icon="material-symbols:star-outline"
                class="w-6 h-6"
                :style="{ color: props.color }"
                v-for="index in (5 - rateFloor)"
                :key="'empty-' + index"
            />
        </div>
        <h1 class="font-medium"
            :style="{ color: props.textcolor }">{{ rate }} by {{ reviewsWithSuffix }}+ reviews</h1>
    </div>
</template>
