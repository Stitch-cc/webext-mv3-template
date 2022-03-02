<script setup>
import config, { getSimpleName } from '../config'
const version = config.version, name = getSimpleName();
</script>

<template>
    <div class="space-y-1 py-3 flex flex-col justify-center items-center text-sm font-bold text-gray-600 border-t border-gray-200">
        <p>
            ©2021
            <a :href="`mailto:${name}@oneclickbooster.com`">{{ name }}</a>
        </p>
        <small>v {{ version }}</small>
    </div>
</template>

<style lang='scss' scoped>
</style>