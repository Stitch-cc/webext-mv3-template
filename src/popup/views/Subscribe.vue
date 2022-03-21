<script setup>
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


</script>

<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Free</th>
                    <th>
                        <div class="space-x-1 flex justify-center items-center text-current">
                            <ri:vip-crown-2-fill />
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
                    <td>≤ 50000</td>
                </tr>
                <tr>
                    <td>EXPORT FOLLOWING</td>
                    <td>≤ 500</td>
                    <td>≤ 50000</td>
                </tr>
            </tbody>
        </table>
        <div class="mt-4 flex flex-col items-center">
            <el-radio-group v-model="index">
                <el-radio-button label="Monthly" />
                <el-radio-button label="Quarterly" />
                <el-radio-button label="Yearly" />
            </el-radio-group>
            <div class="space-x-1 my-3 font-bold text-red-500">
                <sup class="italic align-text-top">$</sup>
                <span class="text-4xl">{{ sku_list[index].amount }}</span>
                <span class="text-gray-500">/ {{ index }}</span>
            </div>
            <p class="font-bold text-red-500">7 days money back guarantee</p>
            <button class="btn btn-blue" @click="onEmailAuth">
                <div class="btn-icon">
                    <ic:round-shopping-cart v-if="!isLoading" />
                    <eos-icons:loading v-else />
                </div>
                <span>Subscribe</span>
            </button>
            <el-checkbox v-model="checked" class="!text-gray-500">
                I accept
                <a class="text-blue-500" href>Terms of Service</a>
            </el-checkbox>
            <p class="text-gray-600 text-xs text-center">
                <ant-design:lock-twotone class="text-green-500 align-text-top" />
                <span>
                    We use
                    <strong>Stripe</strong> to process purchases and do not know your coupon details.
                </span>
            </p>
            <img class="flex" src="/src/assets/images/secure-stripe-payment.jpeg" alt="" srcset="">
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
        padding: 7px;
    }

    thead {
        border-bottom: 1px solid #eee;

        th {
            color: #999;
            padding-top: 10px;

            &:first-child {
                width: 40%;
            }
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