<script setup>
const emits = defineEmits(['success', 'error']);

import { loginByToken } from '../api';
const isLoading = ref(false);
const debounceFn = useDebounceFn(() => {
    chrome.identity.getAuthToken({
        interactive: true,
    }, token => {
        if (token) {
            loginByToken({ token })
                .then((res) => emits('success', res))
                .catch((err) => emits('error', err));
        }
        isLoading.value = false;
    });
}, 500);
const onGoogleAuth = () => {
    isLoading.value = true;
    debounceFn();
};
</script>

<template>
    <button class="btn btn-blue" @click="onGoogleAuth">
        <div class="btn-icon">
            <flat-color-icons:google v-if="!isLoading" />
            <eos-icons:loading v-else />
        </div>
        <span>Sign in with Google</span>
    </button>
</template>

<style lang='scss' scoped>
</style>