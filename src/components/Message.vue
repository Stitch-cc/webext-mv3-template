<script setup>
const config = reactive({
    type: 'info',
    message: '',
    duration: 3000, // 默认展示3s
})

const hideMessage = () => config.show = false;
let timer = null;
watchEffect(() => {
    timer && clearTimeout(timer);
    
    if (config.show && config.duration > 0) {
        timer = setTimeout(() => {
            hideMessage();
        }, config.duration || 3000);
    }
});

const target = ref(null);
onClickOutside(target, hideMessage);

const bus = useEventBus('sendMessage');
bus.on((data) => {
    config.type = data.type;
    config.message = data.message;
    config.duration = data.duration || 3000;
    config.show = true;
});
</script>

<template>
    <div ref="target" :class="`popup-message message-${config.type} ${config.show && 'show-message'}`">
        <clarity:success-standard-solid v-if="config.type == 'success'" />
        <clarity:error-standard-solid v-else-if="config.type == 'error'" />
        <clarity:warning-standard-solid v-else-if="config.type == 'warning'" />
        <clarity:info-standard-solid v-else />
        <span>{{ config.message }}</span>
    </div>
</template>

<style lang="scss" scoped>
.popup-message {
    @apply 'absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0';
    @apply 'box-border space-x-2 px-3 py-1 w-9/10';
    @apply 'border rounded-md text-xs';
    @apply 'svg:(align-text-top)';
    @apply 'transition-all duration-300';
    
    &.show-message {
        @apply 'top-12 opacity-100';
    }

    &.message-info {
        @apply 'text-gray-500 bg-gray-100 border-gray-200';
    }
    &.message-success {
        @apply 'text-green-500 bg-green-50 border-green-200';
    }
    &.message-error {
        @apply 'text-red-500 bg-red-50 border-red-200';
    }
    &.message-warning {
        @apply 'text-orange-500 bg-orange-50 border-orange-200';
    }
}
</style>