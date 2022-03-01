import { createGlobalState, useStorage } from "@vueuse/core";

export const useProfileState = createGlobalState(() => useStorage('ext-profile', null));