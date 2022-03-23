<script setup>
import { setProfile } from '~/store';
import { loginByEmail } from '~/api';

const emits = defineEmits(['success', 'error']);

const isExpanded = ref(false);
const form = reactive({
    email: '',
    password: '',
});
const sendMessage = inject('sendMessage');
const onEmailAuth = async () => {
    if (!form.email || !form.password) {
        sendMessage({
            type: 'error',
            message: 'Please enter your email and password',
        });
        return;
    }
    
    try {
        const res = await loginByEmail(form)
        setProfile(res);
        emits('success', res);
    } catch (error) {
        sendMessage({
            type: 'error',
            message: error.message,
        });
    }
};
</script>

<template>
    <Button v-if="!isExpanded" type="success" text="Sign in with Email" @click="isExpanded = true">
        <line-md:email-twotone-alt />
    </Button>
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
        <Button type="success" text="Sign in with Email" @click="onEmailAuth">
            <ic:twotone-security />
        </Button>
        <p class="font-bold text-dark-50 text-center">
            New to SaveMyDayApp?
            <span
                class="text-current underline underline-current"
            >Create an account.</span>
        </p>
    </div>
</template>

<style lang='scss' scoped>
</style>