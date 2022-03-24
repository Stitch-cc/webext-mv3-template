import { createGlobalState, useStorage } from "@vueuse/core";

const profile = useGlobalState('profile');
const setting = useGlobalState('setting', {
    intervalTime: 8,
    fields: {
        id: { name: "User ID", value: true },
        username: { name: "Username", value: true },
        full_name: { name: "Fullname", value: true },
        followed_by_viewer: { name: "Followed by you", value: true },
        is_verified: { name: "Is verified", value: true },
        profile_url: { name: "Profile URL", value: true },
        profile_pic_url: { name: "Avatar URL", value: true },
    },
});
const cache = useGlobalState('cache', {
    end_cursor: '',
    active_count: 0,
    is_recommend: false
});

function useGlobalState(name, initialValue = null) {
    return useStorage('ext-' + name, initialValue, undefined, {
        serializer: {
            read: (v) => v ? JSON.parse(v) : null,
            write: (v) => JSON.stringify(v),
        }
    });
}

export const useProfileState = createGlobalState(() => profile);
export const clearProfile = () => profile.value = null;
export const setProfile = (data) => profile.value = data;

export const useSettingState = createGlobalState(() => setting);
export const clearSetting = () => setting.value = null;
export const setSetting = (data) => setting.value = data;

export const useCache = createGlobalState(() => cache);
export const clearCache = () => cache.value = null;
export const setCache = (key, value) => cache.value[key] = value;