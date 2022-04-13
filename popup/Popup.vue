<script setup>
// 统计功能
import { reportLog, getProfileByEmail } from '~/api';
import { useProfileState, setProfile } from '~/store';
import { extContentConfig } from '~/config';
provide('reportLog', (name, data) => {
    const { email } = useProfileState().value;
    const { reportPrefix } = extContentConfig;
    reportLog({ email, name: `${reportPrefix}_${name}`, data });
});

// 更新用户账号状态
onBeforeMount(async () => {
    let profileState = useProfileState().value
    if (profileState && profileState.email && profileState.token) {
        const { email, token } = profileState;
        const profile = await getProfileByEmail({ email, token });
        if (profile) {
            console.log("update profile");
            setProfile(profile);
        }
    }
});

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