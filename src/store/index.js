import { getSimpleName } from "../config";
import { createGlobalState, useStorage } from "@vueuse/core";

const profile = useGlobalState("profile");
const setting = useGlobalState("setting", {
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
  hourMaxCounts: 190,
  todayMaxCounts: 950,
});
const cache = useGlobalState("cache", {
  process: {},
  active_count: 0,
  is_recommend: false,
  // 频率检测字段
  historyTimestamp: 0,
  lastTimestamp: 0,
  todayCounts: 0,
  hourCounts: 0,
  isDayReached: false,
  isHourReached: false,
  delayTime: 0,
});

function useGlobalState(name, initialValue = null) {
  const extName = getSimpleName();
  return useStorage(`ext-${extName}-${name}`, initialValue, undefined, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => {
        if (chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.set({
            [`ext-${extName}-${name}`]: v,
          });
        }
        return JSON.stringify(v);
      },
    },
  });
}

export const useProfileState = createGlobalState(() => profile);
export const clearProfile = () => (profile.value = null);
export const setProfile = (data) => (profile.value = data);

export const useSettingState = createGlobalState(() => setting);
export const clearSetting = () => (setting.value = null);
export const setSetting = (data) => (setting.value = data);

export const useCache = createGlobalState(() => cache);
export const clearCache = () => (cache.value = null);
export const setCache = (key, value) => (cache.value[key] = value);

// 背景层
export const getSyncStorage = () => {
  const extName = getSimpleName();
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([`ext-${extName}-profile`, `ext-${extName}-setting`, `ext-${extName}-cache`], (data) => {
      resolve({
        profile: data[`ext-${extName}-profile`],
        setting: data[`ext-${extName}-setting`],
        cache: data[`ext-${extName}-cache`],
      });
    });
  });
}