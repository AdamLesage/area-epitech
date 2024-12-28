<template>
    <div>
        <input v-if="isSupported && isDefaultInput" :type="props.type" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333]"
            @change="handleChange"/>
        <textarea v-if="isSupported && !isDefaultInput" :placeholder="props.name" :value="value" class="border-2 border-[#777] px-3 py-1 rounded-md text-[#333] max-h-36"
            @change="handleChange"></textarea>
        <div v-if="!isSupported">"{{ props.type }}" type is not yet supported by CustomInput component</div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { OptionType } from '@/types/services';

const props = defineProps<{
    name: string;
    type: OptionType;
    value: string | undefined;
}>();

const value = ref<string>(props.value == undefined ? '' : props.value);

watch(() => props.value, (newValue) => {
    value.value = newValue == undefined ? '' : newValue;
});

const emit = defineEmits(['change']);

const isSupported = ref(false);
const isDefaultInput = ref(false);

if (props.type == 'text' || props.type == 'number' || props.type == 'email' || props.type == 'password'
    || props.type == 'date' || props.type == 'time' || props.type == 'month' || props.type == 'week'
    || props.type == 'file' || props.type == 'checkbox' || props.type == 'radio') {
    isSupported.value = true;
    isDefaultInput.value = true;
}
if (props.type == 'textarea') {
    isSupported.value = true;
}

function handleChange(event: Event) {
    emit('change', event);
}
</script>
