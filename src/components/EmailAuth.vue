<script setup>

</script>

<template>
    <button
        box="border"
        flex="~"
        align="items-center"
        w="[100%]"
        bg="green-500 hover:green-600"
        border="~ green-600"
        rounded="md"
        text="white"
        transition="all 0.2s"
    >
        <div p="2" flex="~" bg="light-100" rounded="l-md" text="current">
            <line-md:email-twotone-alt class="w-6 h-6" />
        </div>
        <p justify="center" w="[100%]" text="base">Sign in with Email</p>
    </button>
</template>

<style lang='scss' scoped>
</style>