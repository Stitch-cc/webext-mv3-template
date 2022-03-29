import { getSyncStorage } from "~/store";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "GET_CONFIG") {
        getSyncStorage().then(data => {
            sendResponse({
                profile: data.profile,
                setting: data.setting,
                cache: data.cache,
            });
        });
    }

    return true;
});