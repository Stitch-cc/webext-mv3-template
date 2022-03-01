<script setup>
import config, { getSimpleName } from '../config'
const version = config.version, name = getSimpleName();
</script>

<template>
    <div class="flex flex-col justify-center items-center py-3 text-gray-600 border-t border-gray-100">
        <p class="text-sm mb-1">
            ©2021
            <a :href="`mailto:${name}@oneclickbooster.com`">{{ name }}</a>
        </p>
        <p class="text-xs">v {{ version }}</p>
    </div>
</template>

<style lang='scss' scoped>
</style>