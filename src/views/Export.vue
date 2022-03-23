<script setup>
import { getProfileByUsername } from '~/api/instagram'
import { useSettingState } from '~/store';

const sendMessage = inject('sendMessage');

const data = ref([]);
const profile = reactive({});
const { params, query } = useRoute();
const type = params.type || query.type;
const username = params.username || query.username;
onBeforeMount(async () => {
    let data = await getProfileByUsername(username);
    const { id, edge_follow, edge_followed_by } = data.graphql.user;
    profile.id = id;
    profile.followersCount = edge_followed_by.count;
    profile.followingCount = edge_follow.count;
})

const { intervalTime, fields } = useSettingState().value;
let count = 0;
const { pause, resume, isActive } = useIntervalFn(() => {
    count++;
    console.log(count);
    if (count == 3) {
        pause();
        isActive.value = false;
    }
}, intervalTime * 1000);

const onDownload = () => {
    sendMessage({ type: 'error', message: 'Please login to your instagram account first.' })
}
</script>

<template>
    <div class="w-[100%] border border-gray-100 rounded-md">
        <div class="flex items-center space-x-3">
            <span class="flex">
                <bx:at />
                {{ username }}
            </span>
            <span>{{ profile.followersCount }} followers</span>
            <span>{{ profile.followingCount }} following</span>
        </div>
        <div class="flex flex-row w-2/3 mx-auto space-x-4">
            <Button v-if="isActive" type="danger" text="STOP" :onclick="pause">
                <fa-solid:pause-circle />
            </Button>
            <Button v-else type="primary" text="CONTINUE" :onclick="resume">
                <fa-solid:play-circle />
            </Button>
            <Button
                class="w-1/2"
                type="success"
                :text="`DOWNLOAD ${data.length} ${type.toUpperCase()}`"
                :onclick="onDownload"
            >
                <fa:download />
            </Button>
        </div>
    </div>
</template>