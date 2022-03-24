<script setup>
const { onclick } = defineProps({
    type: {
        type: String,
        default: 'default',
    },
    text: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    onclick: {
        type: Function,
        default: () => { },
    },
})
const isLoading = ref(false);
const debounceFn = useDebounceFn(async () => {
    try {
        await onclick();
        isLoading.value = false;
    } catch (error) {
        console.log(error);
        isLoading.value = false;
    }
}, 500);
const onClick = () => {
    isLoading.value = true;
    debounceFn();
}
</script>

<template>
    <button :class="`btn btn-${type}`" :disabled="disabled" @click="onClick">
        <div class="btn-icon">
            <slot v-if="!isLoading">
                <flat-color-icons:google />
            </slot>
            <eos-icons:loading v-else />
        </div>
        <slot name="text">
            <span>{{ text }}</span>
        </slot>
    </button>
</template>