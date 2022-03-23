<script setup>
import { getProfileByUsername } from '~/api/instagram'

const sendMessage = inject('sendMessage');

const data = ref([]);
const profile = ref(null);
const { params, query } = useRoute();
const type = params.type || query.type;
const username = params.username || query.username;
onBeforeMount(async () => {
    profile.value = await getProfileByUsername(username);
    console.log(profile.value);
})



const isPause = ref(false);
const onPause = () => {
    isPause.value = true;
    // do something for pause
}
const onContinue = () => {
    isPause.value = false;
    // do something for continue
}

const onDownload = () => {
    sendMessage({ type: 'error', message: 'Please login to your instagram account first.'})
}
</script>

<template>
    <div class="w-[100%] border border-gray-100 rounded-md">
        <div class="flex items-center space-x-3">
            <span class="flex"><bx:at />{{ username }}</span>
            <span>{{ profile.followersCount }} followers</span>
            <span>{{ profile.followingCount }} following</span>
        </div>
        <div class="flex flex-row w-2/3 mx-auto space-x-4">
            <Button v-if="!isPause" type="danger" text="STOP" :onclick="onPause">
                <fa-solid:pause-circle />
            </Button>
            <Button v-else type="primary" text="CONTINUE" :onclick="onContinue">
                <fa-solid:play-circle />
            </Button>
            <Button class="w-1/2" type="success" :text="`DOWNLOAD ${data.length} ${type.toUpperCase()}`" :onclick="onDownload">
                <fa:download />
            </Button>
        </div>
    </div>
</template>