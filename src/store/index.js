import { createGlobalState, useStorage } from "@vueuse/core";

const profile = useStorage('ext-profile', null, undefined, {
    serializer: {
        read: (v) => v ? JSON.parse(v) : null,
        write: (v) => JSON.stringify(v),
    }
});

export const useProfileState = createGlobalState(() => profile);

export const clearProfile = () => profile.value = null;
export const setProfile = (data) => profile.value = data;