<template>
    <div>
        <input v-if="isInput" :type="props.type" :placeholder="props.name" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333]"
            @change="handleChange"/>
        <div v-else>"{{ props.type }}" type is not yet supported by CustomInput component</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { OptionType } from '@/types/services';

const props = defineProps<{
    name: string;
    type: OptionType;
}>();

const emit = defineEmits(['change']);

const isInput = ref(false);
if (props.type == 'text' || props.type == 'number' || props.type == 'email' || props.type == 'password'
    || props.type == 'date' || props.type == 'time' || props.type == 'month' || props.type == 'week'
    || props.type == 'file' || props.type == 'checkbox' || props.type == 'radio') {
    isInput.value = true;
}

function handleChange(event: Event) {
    emit('change', event);
}
</script>
