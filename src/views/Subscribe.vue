<script setup>
import { useProfileState } from '~/store';
import { extContentConfig } from '~/config';
import { feedback } from '~/api';
const { email, token, isPro, isSubscribe, member_type, member_time } = useProfileState().value;

// 统计功能
const reportLog = inject('reportLog');
reportLog('subscribe_page');

const index = ref('Monthly');
const sku_list = {
    Monthly: {
        priceId: "price_1IU1sUL3M2iNid2EE4SOzJBi",
        amount: 9.99,
    },
    Quarterly: {
        priceId: "price_1IYRV0L3M2iNid2EB5wVjW1M",
        amount: 18.99,
    },
    Yearly: {
        priceId: "price_1IU203L3M2iNid2E8iqzjvAk",
        amount: 59.99,
    },
}

const checked = ref(false);
// 提交订阅
const sendMessage = inject('sendMessage');
function onSubscribe() {
    if (!checked.value) {
        return sendMessage({ type: 'warning', message: 'You must accept Terms of Service' });
    }
    
    reportLog('subscribe_button');
    window.open("https://www.savemydayapp.com/social/subscribe/redirect.html?priceId=" + sku_list[index.value].priceId + '&email=' + email + '&token=' + token);
}

// 打开服务条款
function toAgreement() {
    window.open(extContentConfig.agreement_url);
}

// 发送反馈消息
const message = ref('');
async function submitFeedback() {
    if (!message.value) {
        return sendMessage({ type: 'warning', message: 'Can not submit blank feedback.' });
    }

    await feedback({ email, message: message.value });
    message.value = '';
    sendMessage({ type: 'success', message: 'Thank you for your feedback, we will get in touch with you as soon as possible.' })
}

</script>

<template>
    <div v-if="!isPro" md="w-500px">
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Free</th>
                    <th>
                        <div class="space-x-1 flex justify-center items-center text-current">
                            <ant-design:crown-filled />
                            <span>Pro</span>
                            <sup>+</sup>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>EXPORT FOLLOWERS</td>
                    <td>≤ 500</td>
                    <td>≤ 80000</td>
                </tr>
                <tr>
                    <td>EXPORT FOLLOWING</td>
                    <td>≤ 500</td>
                    <td>≤ 80000</td>
                </tr>
            </tbody>
        </table>
        <div class="mt-4 flex flex-col items-center">
            <el-radio-group v-model="index">
                <el-radio-button label="Monthly" />
                <el-radio-button label="Quarterly" />
                <el-radio-button label="Yearly" />
            </el-radio-group>
            <div class="space-x-1 mt-3 mb-2 font-bold text-red-500">
                <sup class="italic align-text-top">$</sup>
                <span class="text-4xl">{{ sku_list[index].amount }}</span>
                <span class="text-gray-500">/ {{ index }}</span>
            </div>
            <p class="font-bold text-red-500">7 days money back guarantee</p>
            <Button class="mt-1" type="primary" text="Subscribe" :onclick="onSubscribe">
                <ic:round-shopping-cart />
            </Button>
            <el-checkbox v-model="checked">
                <span class="!text-gray-500 mr-1">I accept</span>
                <a class="text-blue-500" @click="toAgreement">Terms of Service</a>
            </el-checkbox>
            <p class="text-gray-600 text-xs text-center">
                <ant-design:lock-twotone class="inline-block text-green-500 align-text-top" />
                <span>
                    We use
                    <strong>Stripe</strong> to process purchases and do not know your coupon details.
                </span>
            </p>
            <img class="flex" src="/src/assets/images/secure-stripe-payment.jpeg" alt srcset />
        </div>
    </div>
    <div v-else class="space-y-2 flex flex-col items-center text-gray-600" md="w-500px">
        <ant-design:heart-twotone class="w-8 h-8 text-red-500" />
        <p class="mt-2 text-xs font-bold">Thanks for the support!</p>
        <p class="text-base">
            Your
            <strong class="text-current">{{ member_type }}</strong>
            membership will {{ isSubscribe ? 'renewed' : 'end' }} on
        <p class="text-sm text-center"><strong>{{ new Date(member_time).toLocaleString() }}</strong></p>
        </p>
        <el-input v-model="message" type="textarea" :rows="3" maxlength="200" show-word-limit
            placeholder="Any problems and suggestions encountered in the process of use" />
        <Button type="primary" text="Submit Feedback" :onclick="submitFeedback">
            <bi:send-fill />
        </Button>
        <div class="text-xs text-center">
            <div v-if="isSubscribe">
                <p>
                    <router-link to="/Unsubscribe" class="text-blue-500">Click here</router-link>
                    to cancel subscription.
                </p>
                <p>Cancellation will take effect immediately.</p>
            </div>
            <span v-else>You have successfully unsubscribed.</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    line-height: 1.25;
    color: #666;

    td {
        @apply p-2;
    }

    thead {
        @apply border-b border-gray-200;

        th {
            @apply pb-2 text-gray-400 first:(w-[50%]);
        }
    }

    tbody {
        tr {
            box-sizing: border-box;
            width: 100%;
            border-top: 1px solid #eee;

            &:nth-child(even) {
                background-color: #f6f6f6;
            }

            td {
                font-size: 13px;
                text-align: center;

                &:last-child {
                    color: #333;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>