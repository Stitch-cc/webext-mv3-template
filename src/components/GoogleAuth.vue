<script setup>
import { setProfile } from '~/store';
import { loginByToken } from '~/api';

const emits = defineEmits(['success', 'error']);
const onGoogleAuth = async () => {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({
            interactive: true,
        }, token => {
            console.log('token: ' + token);
            if (token) {
                loginByToken({ token })
                    .then((res) => {
                        setProfile(res);
                        resolve(res);
                        emits('success', res);
                    })
            } else {
                emits('error', new Error('Google Auth Failed'));
                reject(new Error('Google Auth Failed'));
            }

        });
    });
};
</script>

<template>
    <Button type="primary" text="Sign in with Google" :onclick="onGoogleAuth">
        <flat-color-icons:google />
    </Button>
</template>

<style lang='scss' scoped>
</style>