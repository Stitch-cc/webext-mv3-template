<script setup>
import { getSimpleName } from '../config'
</script>

<template>
    <div flex="~ row" justify="between" align="items-center" p="p-2">
        <div flex="~ row" align="items-center" space="x-1" text="base current" font="bold">
            <vscode-icons:file-type-excel class="w-6 h-6" />
            <span>{{ getSimpleName() }}</span>
        </div>
        <div flex="~ row" align="items-center" space="x-2" text="base gray-700" font="bold">
            <router-link flex="~" to="/"><fa:home /></router-link>
            <router-link flex="~" to="/about"><eva:info-fill /></router-link>
            <router-link flex="~" to="/settings"><eva:settings-fill /></router-link>
        </div>
        <router-link
            class="text-xs text-light-50"
            to="/subscribe"
            space="x-1"
            flex="~ row"
            align="items-center"
            p="x-2 y-1"
            border="~ red-500"
            rounded="md"
            gradient="to-br from-orange-400 via-red-500 to-yellow-500"
            cursor="pointer"
        >

            <ri:vip-crown-2-fill />
            <span>Pro</span>
            <sup>+</sup>
        </router-link>
    </div>
</template>

<style lang='scss' scoped>
</style>