<script setup>
import { clearProfile, useProfileState } from '../../store'
const router = useRouter();
function onSignOut() {
    clearProfile();
    router.push('/login');
}

const { email } = useProfileState().value;
const intervalTime = ref('8');
const fields = ref([]);
</script>

<template>
    <div class="space-y-2">
        <ul class="space-y-3 font-bold">
            <li>
                <p
                    class="mb-2 font-bold"
                >1.Interval between the requests to get followers/following(s).</p>
                <el-radio-group
                    v-model="intervalTime"
                    size="small"
                    class="space-x-2 children:(!mr-0)"
                >
                    <el-radio label="4" border>4s</el-radio>
                    <el-radio label="5" border>5s</el-radio>
                    <el-radio label="8" border>8s</el-radio>
                    <el-radio label="9" border>9s</el-radio>
                    <el-radio label="10" border>10s</el-radio>
                </el-radio-group>
            </li>
            <li>
                <p>2.Select the fields you want to export.</p>
                <el-checkbox-group v-model="fields" size="small" class="space-y-2 children:(!mr-2)">
                    <el-checkbox label="User ID" value="user_id" border checked />
                    <el-checkbox label="Username" value="username" border checked />
                    <el-checkbox label="Fullname" value="fullname" border checked />
                    <el-checkbox label="Follow by you" value="username" border checked />
                    <el-checkbox label="Is verified" value="username" border checked />
                    <el-checkbox label="Profile URL" value="username" border checked />
                    <el-checkbox label="Avatar URL" value="username" border checked />
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