<script setup>
import { getInnerAssetUrl, windowOpen } from "~/libs/ChromeShims";
import { setProfile } from '~/store';
import { isValidEmail } from "~/libs/validator";
import { loginByEmail } from '~/api';

const emits = defineEmits(['success', 'error']);

const isExpanded = ref(false);
const form = reactive({
    email: '',
    password: '',
});
const sendMessage = inject('sendMessage');
const onEmailAuth = async () => {
    // 邮箱预检
    if (!form.email) {
        sendMessage({
            type: 'error',
            message: 'Email is required.',
        });
        return;
    } else if (!isValidEmail(form.email)) {
        sendMessage({
            type: 'error',
            message: 'Incorrect email address.',
        });
        return;
    }
    // 密码预检
    if (!form.password) {
        sendMessage({
            type: 'error',
            message: 'Password is required.',
        });
        return;
    }

    try {
        const res = await loginByEmail(form)
        setProfile(res);
        emits('success', res);
    } catch (error) {
        // code：10002 用户不存在
        if (error.code === 10002) {
            sendMessage({
                type: 'error',
                message: 'Email or password is incorrect.',
            });
        } else {
            sendMessage({
                type: 'error',
                message: 'Network error please check and retry.',
            });
        }
    }
};

const { useWindowNavigate } = useRoute().meta;
const router = useRouter();
async function toDashboardRegister() {
    if (useWindowNavigate) {
        let url = getInnerAssetUrl('dashboard/index.html#/register');
        await windowOpen(url);
    } else {
        await router.push('/register');
    }
}
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
                class="text-current underline underline-current cursor-pointer"
                @click="toDashboardRegister"
            >Create an account.</span>
        </p>
    </div>
</template>

<style lang='scss' scoped>
</style>