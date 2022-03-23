<script setup>
import { clearProfile, useProfileState, useSettingState } from '~/store'
const router = useRouter();
function onSignOut() {
    clearProfile();
    router.push('/login');
}

const { email } = useProfileState().value;
const setting = useSettingState().value;
console.log(setting);
</script>

<template>
    <div class="space-y-2" md="w-500px">
        <ul class="space-y-3 text-base text-gray-700">
            <li>
                <p
                    class="mb-2"
                >1.Interval between the requests to get followers/following(s).</p>
                <el-radio-group v-model="setting.intervalTime">
                    <el-radio-button :label="4">4s</el-radio-button>
                    <el-radio-button :label="5">5s</el-radio-button>
                    <el-radio-button :label="8">8s</el-radio-button>
                    <el-radio-button :label="9">9s</el-radio-button>
                    <el-radio-button :label="10">10s</el-radio-button>
                </el-radio-group>
            </li>
            <li>
                <p>2.Select the fields you want to export.</p>
                <el-checkbox-group v-model="setting.fields" size="" class="space-y-1 children:(!mr-1)">
                    <el-checkbox label="id" border checked >User ID</el-checkbox>
                    <el-checkbox label="username" border checked >Username</el-checkbox>
                    <el-checkbox label="full_name" border checked >Fullname</el-checkbox>
                    <el-checkbox label="followed_by_viewer" border checked >Follow by you</el-checkbox>
                    <el-checkbox label="is_verified" border checked >Is verified</el-checkbox>
                    <el-checkbox label="profile_url" border checked >Profile URL</el-checkbox>
                    <el-checkbox label="profile_pic_url" border checked >Avatar URL</el-checkbox>
                </el-checkbox-group>
            </li>
        </ul>
        <div class="!mt-4 h-1px bg-gray-200" ></div>
        <p class="space-x-1 flex flex-row items-center justify-center text-gray-600">
            <fa-solid:user-alt class="w-3" />
            <span>{{ email }}</span>
        </p>
        <button class="btn" @click="onSignOut">
            <div class="btn-icon">
                <uil:signout />
            </div>
            <span>Sign out</span>
        </button>
    </div>
</template>