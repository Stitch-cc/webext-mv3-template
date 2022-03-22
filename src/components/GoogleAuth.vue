<script setup>
import { setProfile } from '../store';
import { loginByToken } from '../api';

const emits = defineEmits(['success', 'error']);
const onGoogleAuth = async () => {
    try {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({
                interactive: true,
            }, token => {
                if (token) {
                    loginByToken({ token })
                        .then((res) => {
                            setProfile(res);
                            resolve(res);
                            emits('success', res);
                        })
                } else {
                    reject(new Error('Google Auth Failed'));
                }

            });
        });
    } catch (error) {
        emits('error', error);
        console.log(error);
    }
};
</script>

<template>
    <Button type="primary" text="Sign in with Google" @click="onGoogleAuth">
        <flat-color-icons:google />
    </Button>
</template>

<style lang='scss' scoped>
</style>