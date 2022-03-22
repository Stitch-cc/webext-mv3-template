<script setup>
const username = ref('');

const onclick = () => {
    console.log('onclick');
}
</script>

<template>
    <div>
        <!-- 当用户未登录 instagram 时展示 -->
    </div>
    <div class="space-y-3">
        <InputItem v-model="username" placeholder="Enter instagram username" required>
            <bx:at />
        </InputItem>
        <Button type="primary" text="Export Followers" :onclick="onclick">
            <ph:users-three-duotone class="text-green-500" />
        </Button>
        <Button type="success" text="Export Following" :onclick="onclick">
            <ant-design:heart-twotone class="text-red-500" />
        </Button>
        <p class="space-x-1 flex flex-row items-center justify-center text-sm">
            <fluent:warning-20-filled class="text-orange-500" />
            <span>You need to login</span>
            <a class="text-blue-500 underline" href="https://instagram.com/">instagram.com</a>
        </p>
    </div>
</template>