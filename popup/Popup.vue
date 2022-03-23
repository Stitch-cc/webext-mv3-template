<script setup>
const bus = useEventBus('sendMessage');
provide('sendMessage', bus.emit);
</script>

<template>
    <div class="w-360px antialiased">
        <Header />
        <div class="box-border px-3 py-4">
            <router-view></router-view>
        </div>
        <Footer />
        <Message />
    </div>
</template>

<style lang='scss' scoped>
</style>