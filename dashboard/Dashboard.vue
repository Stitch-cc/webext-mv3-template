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

onBeforeMount(async () => {
    const { email, token } = useProfileState().value;
    const profile = await getProfileByEmail({email, token});
    if (profile) {
        console.log("update profile");
        setProfile(profile);
    }
});

const bus = useEventBus('sendMessage');
provide('sendMessage', bus.emit);
</script>

<template>
    <div class="w-[100%] antialiased">
        <div class="bg-gray-800">
            <Header />
        </div>
        <div class="box-border px-3 py-4" md="py-14 w-1200px mx-auto flex flex-col items-center">
            <router-view></router-view>
        </div>
        <Footer />
        <Message />
    </div>
</template>

<style lang='scss' scoped>
</style>