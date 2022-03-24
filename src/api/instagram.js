import { useAxios } from "./axios";

const { service, $get, $post } = useAxios();
// 基础配置
service.defaults.baseURL = "https://www.instagram.com";
service.defaults.timeout = 5000;
service.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const query_hash = {
    followers: "37479f2b8209594dde7facb0d904896a",
    following: "58712303d941c6855d4e888c5f0cd22f",
    comments: "33ba35852cb50da46f5b5e889df7d159",
};

/**
 * 获取instagram登录状态
 * @returns {string}
 */
import { getCookie } from "~/libs/ChromeShims";
export function isLogined() {
    return getCookie('https://www.instagram.com/', 'ds_user_id');
}

/**
 * 获取用户信息接口
 * @param {string} username 用户昵称
 * @returns {object}
 */
export function getProfileByUsername(username) {
    return $get("/" + username + "/", { __a: 1 });
}

export function getAccountDetails(query_hash, variables) {
    return $get("/graphql/query/", {
        query_hash,
        variables: JSON.stringify(variables),
    });
}

/**
 * 获取用户Followers接口
 * @param {string} id 用户id
 * @param {object}} profile 用户信息
 * @returns {object}
 */
export function getFollowers(id, first, after) {
    return new Promise((resolve, reject) => {
        getAccountDetails(query_hash.followers, {
            id: id,
            first: first ? first : 50,
            after: after ? after : "",
        }).then((res) => {
            resolve(res.data.user.edge_followed_by);
        }).catch(e => {
            reject(e);
        });
    });
}

export function getFollowing(id, first, after) {
    return new Promise((resolve, reject) => {
        getAccountDetails(query_hash.following, {
            id: id,
            first: first ? first : 50,
            after: after ? after : "",
        }).then((res) => {
            resolve(res.data.user.edge_follow);
        }).catch((e) => {
            reject(e);
        });
    });
}

export function fetchPostComments({ shortcode, first, after }) {
    return new Promise((resolve, reject) => {
        getAccountDetails(query_hash.comments, {
            shortcode,
            first: first ? first : 12,
            after: after ? after : "",
        }).then((res) => {
            resolve(res.data.shortcode_media.edge_media_to_comment);
        });
    });
}
