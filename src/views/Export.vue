<script setup>
import { getProfileByUsername } from '~/api/instagram'
import { useProfileState, useSettingState, useCache, setCache, clearCache } from '~/store';
import { isLogined, getFollowers, getFollowing } from '~/api/instagram'
import { ElMessageBox, ElButton } from 'element-plus';
import JsonToCSV from "~/libs/exportToCSV";

const router = useRouter();
const sendMessage = inject('sendMessage');
const { isPro } = useProfileState().value;
const cache = useCache().value;
const { end_cursor, active_count, is_recommend } = cache;
const { intervalTime, fields } = useSettingState().value;

const data = ref([]);
const total = ref(500);

let isPreCheck = false;
const profile = reactive({});
const { params, query } = useRoute();
const type = params.type || query.type;
const username = params.username || query.username;
onBeforeMount(async () => {

})

// 开始导出
let handleFn = type == 'followers' ? getFollowers : getFollowing;
let count = 0; // 记录循环数、用作延长循环间隔;
let temp = end_cursor || ''; // 临时保存 end_cursor;
const { pause, resume, isActive } = useIntervalFn(async () => {
    !isPreCheck && await preCheck();
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

        count++;
    } catch (err) {
        console.log(err);
        sendMessage({ type: 'error', err });
    }
}, intervalTime * 1000, { immediateCallback: true });
async function preCheck() {
    let _profile = await getProfileByUsername(username);
    if (!_profile && !isLogined()) {
        sendMessage({ type: 'error', message: 'Please login to your instagram account first.' });
        return router.push('/');
    }

    const { id, edge_follow, edge_followed_by, is_private } = _profile.graphql.user;
    if (is_private) {
        sendMessage({ type: 'warning', message: 'Private accounts are prohibited from exporting data!' });
        return router.push('/');
    }

    isPreCheck = true;
    profile.id = id;
    profile.followers = edge_followed_by.count;
    profile.following = edge_follow.count;
    total.value = isPro ? profile[type] >= 50000 ? 50000 : profile[type] : profile[type] >= 500 ? 500 : profile[type];
}

// 结束导出
const isCompleted = ref(false);
function finishExport() {
    pause();
    isCompleted.value = true;
    isActive.value = false;

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
    return Math.ceil(data.value.length / total.value * 100)
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
                <span class="text-blue-500 font-bold">{{ data.length }}</span> /
                <span class="text-blue-500 font-bold">{{ total }}</span>
                {{ type }}, please wait a moment...
            </p>
            <p class="text-base text-green-500 font-bold" v-else>
                Export completed!
            </p>
            <el-progress
                class="container"
                :text-inside="true"
                :stroke-width="18"
                :percentage="percentage"
                status="success"
            />
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
            <Button
                class="w-1/2"
                type="success"
                :disabled="isCompleted ? false : isActive"
                :text="`DOWNLOAD ${data.length} ${type.toUpperCase()}`"
                :onclick="onDownload"
            >
                <fa:download />
            </Button>
        </div>
        <p class="my-2 flex flex-row justify-center items-center text-sm text-orange-400">
            <fluent:warning-20-filled class="mr-1" />Download only when finished or stopped
        </p>
        <el-table
            class="container mt-14 shadow shadow-gray-200 border-t border-gray-100 rounded-md svg:(w-6 h-6)"
            :data="data"
            max-height="45vh"
            stripe
        >
            <el-table-column type="index" align="center" />
            <el-table-column
                v-if="fields.profile_pic_url.value"
                prop="profile_pic_url"
                :label="fields.profile_pic_url.name"
                align="center"
                width="100"
            >
                <template #default="scope">
                    <a :href="scope.row.profile_url">
                        <img
                            :src="'https://cdn.getwebooster.workers.dev/' + scope.row.profile_pic_url"
                            class="inline-block w-10 h-10 rounded-full"
                        />
                    </a>
                </template>
            </el-table-column>
            <el-table-column
                v-if="fields.id.value"
                prop="id"
                align="center"
                :label="fields.id.name"
            />
            <el-table-column
                v-if="fields.username.value"
                prop="username"
                :label="fields.username.name"
                align="center"
            />
            <el-table-column
                v-if="fields.full_name.value"
                prop="full_name"
                :label="fields.full_name.name"
                align="center"
            />
            <el-table-column
                v-if="fields.is_verified.value"
                prop="is_verified"
                :label="fields.is_verified.name"
                align="center"
                width="120"
            >
                <template #default="scope">
                    <span v-if="scope.row.is_verified">
                        <ant-design:check-circle-twotone class="text-green-500" />
                    </span>
                    <span v-else>
                        <ant-design:close-circle-twotone class="text-red-500" />
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="fields.followed_by_viewer.value"
                prop="followed_by_viewer"
                :label="fields.followed_by_viewer.name"
                align="center"
                width="150"
            >
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