<script setup>
const usename = ref('');
</script>

<template>
    <div class="space-y-3">
        <InputItem v-model="username" placeholder="Enter instagram username" required>
            <bx:at />
        </InputItem>
        <button class="btn btn-blue" @click="onEmailAuth">
            <div class="btn-icon">
                <ph:users-three-duotone class="text-green-500" />
            </div>
            <span>Export Followers</span>
        </button>
        <button class="btn btn-green" @click="onEmailAuth">
            <div class="btn-icon">
                <ant-design:heart-twotone class="text-red-500" />
            </div>
            <span>Export Following</span>
        </button>
        <p class="space-x-1 flex flex-row items-center justify-center text-sm">
            <fluent:warning-20-filled class="text-orange-500" />
            <span>You need to login</span>
            <a class="text-blue-500 underline" href="https://instagram.com/">instagram.com</a>
        </p>
    </div>
</template>