<script setup>
import { getInnerAssetUrl, windowOpen, getCookie } from "~/libs/ChromeShims";
const sendMessage = inject('sendMessage');

const isLogined = ref(true);
onBeforeMount(async () => {
    isLogined.value = Boolean(await getCookie('https://www.instagram.com', 'ds_user_id'));
})

const username = ref('');
const checkUsername = () => {
    if (!username.value) {
        sendMessage({
            type: 'error',
            message: 'Please enter the username to be exported!'
        })
        return false;
    }
    return true;
}

// 通过获取路由元数据，控制跳转方式
const { useWindowNavigate } = useRoute().meta;
const router = useRouter();
const onclick = async (type) => {
    if (!checkUsername()) return;

    if (useWindowNavigate) {
        let url = getInnerAssetUrl('dashboard/index.html#/Export?type=' + type + '&username=' + username.value);
        await windowOpen(url);
    } else {
        await router.push({
            name: "Export",
            query: { type, username: username.value },
        })
    }
}

// 统计功能
const reportLog = inject('reportLog');
reportLog('home_page');
</script>

<template>
    <div v-if="!isLogined">
        <!-- 当用户未登录 instagram 时展示 -->
        <div class="space-y-2 flex flex-col items-center justify-center">
            <fluent:warning-20-filled class="w-8 h-8 text-orange-500" />
            <p class="text-sm text-gray-600 font-bold">
                You need to login
                <a
                    class="text-blue-500 underline"
                    href="https://instagram.com/"
                >instagram.com</a>
                !
            </p>
        </div>
    </div>
    <div v-else class="space-y-3" md="w-500px">
        <InputItem v-model="username" placeholder="Enter instagram username" required>
            <bx:at />
        </InputItem>
        <Button type="primary" text="Export Followers" :onclick="async () => onclick('followers')">
            <ph:users-three-duotone class="text-green-500" />
        </Button>
        <Button type="success" text="Export Following" :onclick="async () => onclick('following')">
            <ant-design:heart-twotone class="text-red-500" />
        </Button>
    </div>
</template>