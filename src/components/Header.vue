<script setup>
import { getSimpleName } from '~/config'

import { useProfileState } from '~/store'
const isAuthenticated = useProfileState();
</script>

<template>
    <div
        class="flex flex-row items-center justify-between p-2 border-b border-gray-200"
        md="w-1200px mx-auto border-none"
    >
        <div class="space-x-1 flex flex-row items-center text-base text-current font-bold">
            <vscode-icons:file-type-excel class="w-6 h-6" />
            <span>{{ getSimpleName() }}</span>
        </div>
        <div
            class="flex flex-row items-center text-base text-gray-700 font-bold children:(flex items-center p-1 h-6 cursor-pointer)"
            md="text-light-50 space-x-2 children:(space-x-1)"
        >
            <router-link to="/">
                <fa:home />
                <span class="hidden" md="flex">Dashboard</span>
            </router-link>
            <router-link to="/about">
                <eva:info-fill />
                <span class="hidden" md="flex">FAQs</span>
            </router-link>
            <router-link v-if="isAuthenticated" to="/settings">
                <eva:settings-fill />
                <span class="hidden" md="flex">Setting</span>
            </router-link>
        </div>
        <div class="flex flex-row space-x-2" v-if="isAuthenticated">
            <!-- TODO 适配dashboard下展示产品列表 -->
            <!-- <el-select class="hidden">
                <el-option label="111"></el-option>
            </el-select> -->
            <router-link
                class="space-x-1 px-2 py-1 flex flex-row items-center border border-red-500 rounded-md text-xs text-light-50 cursor-pointer"
                to="/subscribe"
                gradient="to-br from-orange-400 via-red-500 to-yellow-500"
            >
                <ant-design:crown-filled />
                <span>Pro</span>
                <sup>+</sup>
            </router-link>
        </div>
    </div>
</template>

<style lang='scss' scoped>
</style>