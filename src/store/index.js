import { createGlobalState, useStorage } from "@vueuse/core";

const profile = useGlobalState('profile');
const setting = useGlobalState('setting', {
    intervalTime: 8,
    fields: ['id', 'username', 'full_name', 'followed_by_viewer', 'is_verified', 'profile_url', 'profile_pic_url']
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