export function getCookie(url, name) {
    return new Promise((resolve, reject) =>
        chrome.cookies.get({ url, name }, (cookie) => resolve(cookie && cookie.value))
    );
}

export function getInnerAssetUrl(...paths) {
    let extId = chrome.runtime.id;
    return "chrome-extension://" + extId + "/" + paths.join("/");
}

export function windowOpen(url) {
    return new Promise((resolve, reject) =>
        chrome.windows.create({ url }, (win) => resolve(win))
    );
}