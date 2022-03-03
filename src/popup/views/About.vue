<script setup>
import { clearProfile } from '../../store'
const router = useRouter();
function onSignOut() {
    clearProfile();
    router.push('/login');
}

import { useProfileState } from '../../store';
const { email } = useProfileState().value;
</script>

<template>
    <div class="space-y-2">
        <p class="space-x-1 flex flex-row items-center justify-center text-gray-600">
            <fa-solid:user-alt />
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