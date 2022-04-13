<script setup>
import { getProfileByUsername } from '~/api/instagram'
import { useProfileState, useSettingState, useCache, setCache, clearCache } from '~/store';
import { isLogined, getFollowers, getFollowing } from '~/api/instagram'
import { ElMessageBox } from 'element-plus';
import JsonToCSV from "~/libs/exportToCSV";
import { checkRateLimit } from '~/libs/instagramRateLimit';
const reportLog = inject('reportLog');

const router = useRouter();
const sendMessage = inject('sendMessage');
const { isPro } = useProfileState().value;
const cache = useCache().value;
const setting = useSettingState().value;
const { intervalTime, fields } = setting;

const data = ref([]);
const total = ref(500);

const profile = reactive({});
const { params, query } = useRoute();
const type = params.type || query.type;
const username = params.username || query.username;
let handleFn = type == 'followers' ? getFollowers : getFollowing;
let temp = ''; // 临时保存 end_cursor;

const beginCount = ref(0);
const curCount = computed(() => {
    return beginCount.value + data.value.length;
});

// 开始导出
// 请求频率检查：instagram限制1小时200次请求
const isReached = ref(false);
const secDiff = ref(0);
const autoContinueTime = computed(() => {
    // 转化格式为 时h分m秒s
    const _diff = secDiff.value;
    const _hour = Math.floor(_diff / 3600);
    const _min = Math.floor((_diff - _hour * 3600) / 60);
    const _sec = Math.floor(_diff % 60);
    return `${_hour}h ${_min}m ${_sec}s`;
});
watchEffect(() => {
    if (isReached.value) {
        let timer = setInterval(() => {
            secDiff.value--;
            if (secDiff.value <= 0) {
                clearInterval(timer);
                isReached.value = false;

                // 控制UI切换成继续状态
                isActive.value = true;
                resume();
            }
        }, 1000);
    }
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isCheckInfo = false, isCheckCache = false;
const { pause, resume, isActive } = useIntervalFn(async () => {
    if (!isCheckInfo) await checkInfo();
    if (!isCheckCache) return await checkCache();

    isReached.value = checkRateLimit();
    if (isReached.value) {
        secDiff.value = Math.ceil(cache.delayTime / 1000);
        // 保存节点，下次导出时延续导出
        if (data.value.length > 0) {
            cache.process[username] = Object.assign({}, cache.process[username], { [type]: { end_cursor: temp, exported_count: data.value.length } });
        }
        pause();
        isActive.value = false;
        return await delay(cache.delayTime);
    }
    try {
        const { page_info, edges } = await handleFn(profile.id, 50, temp);

        // 处理接口返回数据
        for (let i = 0; i < edges.length; i++) {
            const node = edges[i].node;
            node.profile_url = 'https://www.instagram.com/' + node.username;
            data.value.push(node);
            if (data.value.length == total.value) {
                // 终止计时器
                return finishExport();
                // isPro && setCache('end_cursor', page_info.end_cursor);
            }
        }

        // 判断是否检索完成
        const { has_next_page, end_cursor } = page_info;
        if (!has_next_page) {
            // 检索完成
            finishExport();
        } else {
            temp = end_cursor;
        }
    } catch (err) {
        // 统计错误
        reportLog('export_error', {
            username,
            type,
            error: err.message,
            cache: JSON.stringify(cache)
        });

        // 429 暂停进程
        pause();
        isActive.value = false;
        // 保存当前状态
        let now = Date.now();
        if (data.value.length > 0 && err.message.indexOf('429') > -1) {
            await onDownload();
            cache.process[username] = Object.assign({}, cache.process[username], { [type]: { end_cursor: temp, exported_count: data.value.length } });
            let halfDay = 12 * 60 * 60 * 1000, nextTime = new Date(now + halfDay).toLocaleString();
            sendMessage({ type: 'error', message: 'Reached instagram request limit, please try again after ' + nextTime + ', the current progress has been saved and downloaded automatically.', duration: 0 });
        } else {
            let oneHour = 60 * 60 * 1000, nextTime = new Date(now + oneHour).toLocaleString();
            sendMessage({ type: 'error', message: 'Instagram errors,if the error persists after retrying, please try again after' + nextTime + '.', duration: 0 });
            await router.push('/');
        }
    }
}, intervalTime * 1000, { immediateCallback: true });
async function checkInfo() {
    try {
        // 检查是否登录，获取账号基本信息
        let _profile = await getProfileByUsername(username);
        if (!isLogined()) {
            sendMessage({ type: 'error', message: 'Please login to your instagram account first.', duration: 0 });
            return await router.push('/');
        }
        if (!_profile.graphql) {
            sendMessage({ type: 'error', message: 'Please log in to your account again before exporting.', duration: 0 });
            window.open('https://www.instagram.com')
            return await router.push('/');
        }

        const { id, edge_follow, edge_followed_by, is_private } = _profile.graphql.user;
        if (is_private) {
            sendMessage({ type: 'warning', message: 'Private accounts are prohibited from exporting data!' });
            return await router.push('/');
        }

        profile.id = id;
        profile.followers = edge_followed_by.count;
        profile.following = edge_follow.count;
        total.value = isPro ? profile[type] >= 80000 ? 80000 : profile[type] : profile[type] >= 500 ? 500 : profile[type];
        isCheckInfo = true;
    } catch (err) {
        // 统计错误
        reportLog('export_error', {
            username,
            type,
            error: err.message
        });
        sendMessage({ type: 'error', message: err.message || "Network Error" });
    }
}
async function checkCache() {
    // 开始导出前检查是否存在上一次导出的缓存
    return new Promise(resolve => {
        if (cache.process[username] && cache.process[username][type]) {
            pause();
            isActive.value = false;
            ElMessageBox.confirm(`Detect the cache of the previous process and continue it?`, 'Notice', {
                confirmButtonText: 'Continue',
                cancelButtonText: 'Restart',
                type: 'warning'
            }).then(() => {
                temp = cache.process[username][type].end_cursor;
                beginCount.value = cache.process[username][type].exported_count || 0;
            }).catch(() => {
                delete cache.process[username][type];
            }).finally(() => {
                resume();
                isActive.value = true;
                resolve();
            })
        }
        resolve(isCheckCache = true);
    })
}

// 结束导出
const isCompleted = ref(false);
function finishExport() {
    pause();
    isCompleted.value = true;
    isActive.value = false;

    cache.process[username] && delete cache.process[username][type];

    // 部分数据不能完全导出、需要对比已导出数量与总量的关系
    if (data.value.length < total.value) {
        total.value = data.value.length;
        sendMessage({ type: 'success', message: `Total ${total.value} valid ${type} exported.` })
    }

    // 添加计数器，活跃后求赞功能
    cache.active_count++;
    let RECOMMEND_COUNT = 50;

    if (cache.active_count % RECOMMEND_COUNT == 0 && !cache.is_recommend) {
        ElMessageBox.confirm(
            "Did the plugin help you? We need your encouragement, give us a 5-star review!",
            'Invitation',
            {
                confirmButtonText: 'OF Course',
                cancelButtonText: 'Later'
            }).then(() => {
                window.open('https://chrome.google.com/webstore/detail/insexport-get-instagram-f/okmokimdgjhndamggnkdojhbofdmepno');
                cache.is_recommend = true;
            }).catch(() => {
                cache.is_recommend = false;
            });
    }
}

// 处理当前进度
const percentage = computed(() => {
    if (total.value === 0) return 0;
    return Math.floor(data.value.length / total.value * 100)
})

const onDownload = async () => {
    await JsonToCSV.setDataConver({
        data: toRaw(data.value),
        fileName: `${username}-${type}`,
        showLabel: true,
        columns: {
            title: Array.from(
                Object.values(fields),
                (x) => x.value && x.name
            ).filter(Boolean),
            key: Array.from(
                Object.entries(fields),
                (x) => x[1].value && x[0]
            ).filter(Boolean),
        },
    });
}

// 监听页面离开
function unloadHandler(e) {
    if (data.value.length > 0) {
        cache.process[username] = Object.assign({}, cache.process[username], { [type]: { end_cursor: temp, exported_count: data.value.length } });
    }

    e.preventDefault();
    e.returnValue = false;
    return '';
}
onMounted(() => {
    window.addEventListener('beforeunload', unloadHandler);
})
onBeforeUnmount(() => {
    pause();
    isActive.value = false;
    window.removeEventListener('beforeunload', unloadHandler);
})
</script>

<template>
    <div class="w-[100%]">
        <div class="flex items-center p-2 space-x-3 text-sm border-b border-gray-200">
            <p class="flex text-base font-bold">
                <bx:at class="w-4 h-6" />
                {{ username }}
            </p>
            <p>
                <span class="font-bold">{{ profile.followers }}</span> followers
            </p>
            <p>
                <span class="font-bold">{{ profile.following }}</span> following
            </p>
        </div>
        <div class="mt-10 mb-4 space-y-2 container flex flex-col items-center font-bold">
            <p class="text-base" v-if="!isCompleted">
                Exporting
                <span class="text-blue-500 font-bold">{{ curCount }}</span> /
                <span class="text-blue-500 font-bold">{{ total }}</span>
                {{ type }}, please wait a moment...
            </p>
            <p class="text-base text-green-500 font-bold" v-else>Export completed!</p>
            <el-progress class="container" :text-inside="true" :stroke-width="18" :percentage="percentage"
                status="success" />
        </div>
        <div class="flex flex-row w-1/2 mx-auto space-x-4">
            <div v-if="!isCompleted" class="container">
                <Button v-if="isActive" type="danger" text="STOP" @click="pause">
                    <fa-solid:pause-circle />
                </Button>
                <Button v-else type="primary" text="CONTINUE" @click="resume">
                    <fa-solid:play-circle />
                </Button>
            </div>
            <Button class="w-1/2" type="success" :disabled="isCompleted ? false : isActive"
                :text="`DOWNLOAD ${data.length} ${type.toUpperCase()}`" :onclick="onDownload">
                <fa:download />
            </Button>
        </div>
        <p v-if="!isReached" class="my-2 flex flex-row justify-center items-center text-sm text-orange-400">
            <fluent:warning-20-filled class="mr-1" />Download only when finished or stopped
        </p>
        <div v-else class="my-2 flex flex-col justify-center items-center text-sm">
            <p class="flex text-red-600">
                <fluent:warning-20-filled class="mr-1" />
                Reached the instagram limit, we will automatically continue after {{ autoContinueTime }}.
            </p>
            <p v-if="data.length > 0" class="flex text-green-600">
                <fe:smile-heart class="mr-1" />We have saved the process and will continue it the next time we export.
            </p>
        </div>
        <el-table class="container mt-14 shadow shadow-gray-200 border-t border-gray-100 rounded-md svg:(w-6 h-6)"
            :data="data.slice(0, 100)" max-height="45vh" stripe lazy>
            <el-table-column type="index" align="center" />
            <el-table-column v-if="fields.profile_pic_url.value" prop="profile_pic_url"
                :label="fields.profile_pic_url.name" align="center" width="100">
                <template #default="scope">
                    <a :href="scope.row.profile_url">
                        <img :src="'https://cdn.getwebooster.workers.dev/' + scope.row.profile_pic_url"
                            class="inline-block w-10 h-10 rounded-full" />
                    </a>
                </template>
            </el-table-column>
            <el-table-column v-if="fields.id.value" prop="id" align="center" :label="fields.id.name" />
            <el-table-column v-if="fields.username.value" prop="username" :label="fields.username.name"
                align="center" />
            <el-table-column v-if="fields.full_name.value" prop="full_name" :label="fields.full_name.name"
                align="center" />
            <el-table-column v-if="fields.is_verified.value" prop="is_verified" :label="fields.is_verified.name"
                align="center" width="120">
                <template #default="scope">
                    <span v-if="scope.row.is_verified">
                        <ant-design:check-circle-twotone class="text-green-500" />
                    </span>
                    <span v-else>
                        <ant-design:close-circle-twotone class="text-red-500" />
                    </span>
                </template>
            </el-table-column>
            <el-table-column v-if="fields.followed_by_viewer.value" prop="followed_by_viewer"
                :label="fields.followed_by_viewer.name" align="center" width="150">
                <template #default="scope">
                    <span v-if="scope.row.followed_by_viewer">
                        <ant-design:check-circle-twotone class="text-green-500" />
                    </span>
                    <span v-else>
                        <ant-design:close-circle-twotone class="text-red-500" />
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>