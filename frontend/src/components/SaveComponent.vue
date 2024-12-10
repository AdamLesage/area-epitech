<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
    saves: number,
    color: string,
    textcolor: string,
}>()

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

const savesWithSuffix = formatNumberWithSuffix(props.saves);
</script>

<template>
    <div class="flex items-center gap-2">
        <div class="flex items-center justify-start">
            <Icon 
                icon="material-symbols:bookmark-outline" 
                class="w-6 h-6" 
                :style="{ color: props.color }"
            />
        </div>
        <h1 class="font-medium"
            :style="{ color: props.textcolor }">Saved by {{ savesWithSuffix }}+ reviews</h1>
    </div>
</template>
