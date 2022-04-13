<script setup>
import { Icon } from '@iconify/vue';
import { getProdList } from '~/api';
import { getSimpleName } from '~/config'
import { useProfileState } from '~/store'
const isAuthenticated = useProfileState();
const reportLog = inject('reportLog');

// 接口获取产品列表
const prodList = ref([]);
onBeforeMount(() => {
    // 获取屏幕宽度，移动端不适用
    const width = window.innerWidth;
    if (width > 768) {
        getProdList().then(res => {
            if (typeof res === 'object') {
                prodList.value = res;
            } else {
                prodList.value = formatAndParseArrayString(res);
            }
        });
    }
})
// 将数组字符串转换为数组
function formatAndParseArrayString(str) {
    let res = '';
    res = str.replaceAll('\n', '').replaceAll("'", '"');
    res = res.replaceAll('svg', '"svg"');
    res = res.replaceAll('img', '"img"');
    res = res.replaceAll('title', '"title"');
    res = res.replaceAll('href', '"href"');
    res = res.replace(',]', ']');
    return JSON.parse(res);
}

function handleProdMenu(href) {
    // 根据href过滤prodList
    const targetProd = prodList.value.filter(item => item.href === href)[0];
    reportLog('click_product_menu', targetProd.title.split('-')[0].trim());
    window.open(href, '_blank');
}

</script>

<template>
    <div class="flex flex-row items-center justify-between p-2 border-b border-gray-200 bg-current/8"
        md="w-1200px mx-auto border-none bg-transparent">
        <div class="space-x-1 flex flex-row items-center text-base text-current font-bold">
            <slot>
                <vscode-icons:file-type-excel class="w-6 h-6" />
            </slot>
            <span>{{ getSimpleName() }}</span>
        </div>
        <div class="flex flex-row items-center text-base text-gray-700 font-bold children:(flex items-center p-1 rounded-md cursor-pointer svg:w-4.5 svg:h-4.5)"
            md="text-light-50 space-x-2 children:(px-2 space-x-1)">
            <router-link to="/" class="hover:bg-current/12" md="hover:bg-gray-700">
                <fa:home />
                <span class="hidden" md="flex">Dashboard</span>
            </router-link>
            <router-link to="/about" class="hover:bg-current/12" md="hover:bg-gray-700">
                <eva:info-fill />
                <span class="hidden" md="flex">FAQs</span>
            </router-link>
            <router-link v-if="isAuthenticated" to="/settings" class="hover:bg-current/12" md="hover:bg-gray-700">
                <eva:settings-fill />
                <span class="hidden" md="flex">Setting</span>
            </router-link>
        </div>
        <div class="relative flex flex-row space-x-2" v-if="isAuthenticated">
            <!-- TODO 适配dashboard下展示产品列表 -->
            <el-dropdown v-if="prodList.length > 0" class="hidden !absolute top-0 right-full" md="flex items-center"
                @command="handleProdMenu">
                <p
                    class="px-2 py-1 flex flex-row items-center text-light-50 cursor-pointer border border-gray-200 rounded-md">
                    <fluent:ribbon-star-24-filled class="text-yellow-400 w-5 h-5" />
                    <span class="w-30">Social Media Tools</span>
                    <ic:round-keyboard-arrow-down class="el-icon--right" />
                </p>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in prodList" :command="item.href" :divided="index > 0">
                            <Icon v-if="item.svg" class="w-6 h-6 mr-1" :icon="item.svg.icon" :color="item.svg.color" />
                            <el-image v-if="item.img" :src="item.img" class="w-6 h-6 mr-1" />
                            <span>{{ item.title }}</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <router-link
                class="space-x-1 px-2 py-1 flex flex-row items-center border border-red-500 rounded-md text-xs text-light-50 cursor-pointer"
                to="/subscribe" gradient="to-br from-orange-400 via-red-500 to-yellow-500">
                <ant-design:crown-filled />
                <span>Pro</span>
                <sup>+</sup>
            </router-link>
        </div>
    </div>
</template>

<style lang='scss' scoped>
</style>