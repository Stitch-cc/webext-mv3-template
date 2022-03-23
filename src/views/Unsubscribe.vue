<script setup>
// 获取用户会员时间，查询剩余天数
import { useProfileState } from '~/store';
import { feedback, reportLog, unsubscribe } from '~/api';
const { grade, email, token, member_time } = useProfileState().value;

const day = computed(() => Math.ceil((new Date(member_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
const config = reactive({
    index: 1,
    hasTips: true,
    reason: '',
    feedback: ''
})

const sendMessage = inject('sendMessage');
async function handleUnsubscribe() {
    switch (config.index) {
        case 1:
            config.index++;
            break;
        case 2:
            if (config.reason.length === 0) {
                sendMessage({ type: 'warning', message: 'Please select the reason for unsubscribe.' });
                return;
            }
            config.hasTips = false;
            config.index++;
            break;
        case 3:
            if (config.feedback != '') {
                await feedback({ email, message: config.feedback });
            }
            await reportLog({
                email, name: 'unsubscribe', data: {
                    reason: config.reason,
                    feedback: config.feedback
                }
            })
            try {
                await unsubscribe({ grade, email, token });
                sendMessage({ type: 'success', message: 'Unsubscribed successfully.' });
                router.push('/');
            } catch (error) {
                sendMessage({ type: 'danger', message: 'Network error, please try again later.' });
            }
            break;
    }
}

const router = useRouter();
function toSubscribe() {
    router.push('/subscribe');
}
</script>

<template>
    <div class="flex flex-col space-y-2" md="w-500px">
        <div
            class="flex flex-row items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-500 text-xs border border-blue-200 rounded-md"
            v-if="config.hasTips"
        >
            <ant-design:bell-twotone />
            <p>
                You still have
                <strong>{{ day }} days left</strong> in your free trial.
            </p>
        </div>
        <div class v-if="config.index == 1">
            <h2 class="text-base font-bold">You'll miss out on...</h2>
            <ul class="flex flex-col justify-center items-center text-gray-600 text-sm list-circle">
                <li>Export 50000 followers/following.</li>
            </ul>
        </div>
        <div class="step" v-if="config.index == 2">
            <h2>Why do you want to cancel?</h2>
            <el-radio-group v-model="config.reason">
                <el-radio label="I don't use all of the feature" />
                <el-radio label="It doesn't work properly" />
                <el-radio label="I want to change to a yearly subscription" />
                <el-radio label="Other" />
            </el-radio-group>
        </div>
        <div class="step" v-if="config.index == 3">
            <h2>Why do you want to cancel?</h2>
            <el-input
                v-model="config.feedback"
                :rows="4"
                type="textarea"
                maxlength="200"
                placeholder="Tell us why you're canceling..."
                show-word-limit
            />
        </div>
        <div class="button-group">
            <Button type="success" :onclick="toSubscribe">
                <ant-design:crown-twotone />
                <template #text>
                    <span>
                        Keep Pro
                        <sup>+</sup>
                    </span>
                </template>
            </Button>
            <Button type="danger" text="Canceled subscription" :onclick="handleUnsubscribe">
                <ant-design:alert-twotone />
            </Button>
        </div>
    </div>
</template>

<style lang='scss' scoped>
i {
    margin-right: 5px;
}

.popup-wrapper {
    padding: 20px 15px;
}
.tips {
    margin: 0 auto 10px auto;
    padding: 12px 10px;
    box-sizing: border-box;
    max-width: 1000px;
    background-color: #bbd9fc;
    border-radius: 4px;
    font-size: 14px;
}

.step {
    h2 {
        margin: 0;
        line-height: 2;
        font-size: 17px;
        text-align: left;
    }

    ul {
        li {
            text-indent: 5px;
            font-size: 14px;
            font-weight: bold;
            color: #444;
            line-height: 2;
        }
    }

    :deep(.van-radio) {
        margin-top: 8px;
        font-size: 15px;
    }

    :deep(.van-cell) {
        border: 1px solid #ccc;
        border-radius: 4px;
    }
}

.button-group {
    margin-top: 20px;

    button {
        margin-top: 10px;
    }
}
</style>