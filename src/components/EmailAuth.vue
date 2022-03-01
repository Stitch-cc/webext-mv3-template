<script setup>
const isExpanded = ref(false);
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
        <div class="input-item text-blue-500">
            <line-md:email-twotone-alt />
            <input type="email" placeholder="Enter your email address." autofocus />
        </div>
        <div class="input-item text-orange-500">
            <ant-design:lock-twotone />
            <input type="password" placeholder="Enter your password." />
        </div>
        <button class="btn btn-green">
            <div class="btn-icon">
                <ic:twotone-security />
            </div>
            <span>Sign in</span>
        </button>
        <p class="font-bold text-dark-50 text-center">New to SaveMyDayApp? <span class="text-current underline underline-current">Create an account.</span></p>
    </div>
</template>

<style lang='scss' scoped>
</style>