<script setup>
function handleSuccess(res) {
    console.log('success', res);
}
function handleError(error) {
    console.log('error', error);
}
</script>

<template>
<div space="y-4">
    <GoogleAuth @success="handleSuccess" @error="handleError"/>
    <EmailAuth @success="handleSuccess" @error="handleError"/>
</div>
</template>

<style lang='scss' scoped>

</style>