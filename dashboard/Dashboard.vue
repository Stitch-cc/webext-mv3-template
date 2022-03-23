<script setup>
const bus = useEventBus('sendMessage');
provide('sendMessage', bus.emit);
</script>

<template>
    <div class="w-[100%] antialiased">
        <div class="bg-gray-800">
            <Header />
        </div>
        <div class="box-border px-3 py-4" md="py-14 w-4/5 max-w-1200px mx-auto flex flex-col items-center">
            <router-view></router-view>
        </div>
        <Footer />
        <Message />
    </div>
</template>

<style lang='scss' scoped>
</style>