<script setup>
import { getSimpleName } from '../config'

import { useProfileState } from '../store'
const isAuthenticated = useProfileState();
</script>

<template>
    <div flex="~ row" justify="between" align="items-center" p="p-2">
        <div class="space-x-1 flex flex-row items-center text-base text-current font-bold">
            <vscode-icons:file-type-excel class="w-6 h-6" />
            <span>{{ getSimpleName() }}</span>
        </div>
        <div class="space-x-2 flex flex-row items-center text-base text-gray-700 font-bold children:flex">
            <router-link to="/"><fa:home /></router-link>
            <router-link to="/about"><eva:info-fill /></router-link>
            <router-link v-if="isAuthenticated" to="/settings"><eva:settings-fill /></router-link>
        </div>
        <router-link
            v-if="isAuthenticated"
            class="space-x-1 px-2 py-1 flex flex-row items-center border border-red-500 rounded-md text-xs text-light-50 cursor-pointer"
            to="/subscribe"
            gradient="to-br from-orange-400 via-red-500 to-yellow-500"
        >

            <ri:vip-crown-2-fill />
            <span>Pro</span>
            <sup>+</sup>
        </router-link>
    </div>
</template>

<style lang='scss' scoped>
</style>