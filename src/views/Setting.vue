<script setup>
import { clearProfile, useProfileState, useSettingState } from '~/store'
const router = useRouter();
function onSignOut() {
    clearProfile();
    router.push('/login');
}

const { email, isPro } = useProfileState().value;
const setting = useSettingState().value;
</script>

<template>
    <div class="space-y-2" md="w-500px">
        <ul class="space-y-3 text-base text-gray-700">
            <li>
                <p class="mb-1">1.Interval between the requests to get followers/following(s).</p>
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
                <div class="space-y-1 children:(!mr-1)">
                    <el-checkbox
                        v-for="(field, key) in setting.fields"
                        v-model="field.value"
                        :label="key"
                        border
                        :checked="field.value"
                    >{{ field.name }}</el-checkbox>
                </div>
            </li>
            <!-- <li v-if="isPro">
                <p class="flex items-center space-x-1">
                    3.Control
                    <span class="mx-1 text-red-500 font-bold">Max Request</span> per Hour/Day.
                    <el-tooltip
                        content="Protect your account security based on instagram rate limits."
                        placement="top"
                    >
                        <ant-design:question-circle-filled class="w-5 h-5 text-gray-400 cursor-pointer" />
                    </el-tooltip>
                </p>
                <div>
                    <p>
                        <span class="text-sm font-bold">Max per hour</span>
                        <small>(Ideal total: {{ setting.hourMaxCounts * 50 }})</small>:
                    </p>
                    <el-slider
                        v-model="setting.hourMaxCounts"
                        size="small"
                        show-input
                        input-size="small"
                        :min="10"
                        :max="200"
                    />
                    <p>
                        <span class="text-sm font-bold">Max per day:</span>
                        <small>(Ideal total: {{ setting.todayMaxCounts * 50 }})</small>:
                    </p>
                    <el-slider
                        v-model="setting.todayMaxCounts"
                        size="small"
                        show-input
                        input-size="small"
                        :min="200"
                        :max="1000"
                    />
                </div>
            </li> -->
        </ul>
        <div class="!mt-4 h-1px bg-gray-200"></div>
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