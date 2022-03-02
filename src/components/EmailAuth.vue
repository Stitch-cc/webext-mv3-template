<script setup>
const emits = defineEmits(['success', 'error']);

const isExpanded = ref(false);
const isLoading = ref(false);

import { loginByEmail } from '../api';
const form = reactive({
    email: '',
    password: '',
});
const debounceFn = useDebounceFn(() => {
    loginByEmail(form)
        .then((res) => emits('success', res))
        .catch((err) => emits('error', err));
    isLoading.value = false;
}, 500);
const onEmailAuth = () => {
    isLoading.value = true;
    debounceFn();
};
</script>

<template>
    <button v-if="!isExpanded" class="btn btn-green" @click="isExpanded = true">
        <div class="btn-icon text-green-500">
            <line-md:email-twotone-alt />
        </div>
        <span>Sign in with Email</span>
    </button>
    <div v-else class="space-y-3">
        <p text="sm center">or</p>
        <InputItem
            v-model="form.email"
            type="email"
            placeholder="Enter your email address."
            autofocus
            required
        >
            <line-md:email-twotone-alt class="text-blue-500" />
        </InputItem>
        <InputItem
            v-model="form.password"
            type="password"
            placeholder="Enter your password."
            required
        >
            <ant-design:lock-twotone class="text-orange-500" />
        </InputItem>
        <button class="btn btn-green" @click="onEmailAuth">
            <div class="btn-icon">
                <ic:twotone-security v-if="!isLoading" />
                <eos-icons:loading v-else />
            </div>
            <span>Sign in with Email</span>
        </button>
        <p class="font-bold text-dark-50 text-center">
            New to SaveMyDayApp?
            <span
                class="text-current underline underline-current"
            >Create an account.</span>
        </p>
        {{ form }}
    </div>
</template>

<style lang='scss' scoped>
</style>