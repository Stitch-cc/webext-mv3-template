import { useAxios } from './axios'

const { service, $get, $post } = useAxios();
service.defaults.baseURL = 'https://api.savemydayapp.com';
service.defaults.timeout = 5000;
service.defaults.headers.post["Content-Type"] == 'application/x-www-form-urlencoded'; // ? 上传修改 multipart/form-data; 请求返回JSON格式 Content-Type: application/json;

// * 获取插件命获取对应用户信息
import { getSimpleName } from '../config';
const channel = getSimpleName();

export function register({ email, code, password }) {
    return $post('/user/register', { phone: email, code, password, channel }).then(parseProfile);
}

export function sendCodeToEmail({ email }) {
    return $post('/user/sendEmail', { email });
}

export function loginByEmail({ email, password }) {
    return $post('/user/login', { phone: email, password, channel }).then(parseProfile);
}

export function loginByToken({ token }) {
    return $get('/user/google', { code: token, channel }).then(parseProfile);
}

export function getProfileByEmail({ email, token }) {
    return $post('/user/phoneProfile', { phone: email, token, channel }).then(parseProfile);
}

export function updateAccount({ email, token, value }) {
    value = value > 0 ? -value : value;
    return $post('/user/updateAccount', { phone: email, token, value, channel }).then(parseProfile);
}

export function unsubscribe({ grade, email, token }) {
    return $post('/user/CancelSubscription', { grade, phone: email, token });
}

export function feedback({ email, message }) {
    return useAxios().$post('https://sctapi.ftqq.com/SCT51636TKNKUrjipLUdCCfukjPZ0PFbN.send', { title: channel + '_' + email, desp: message });
}

export function reportLog({ email, name, data }) {
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }
    return $post('/analytics/ReportLog', { phone: email, extension: channel, name, data });
}

function parseProfile(res) {
    return new Promise((resolve, reject) => {
        const { code, data, msg } = res;
        if (code === 200) {
            const { phone, Token, grade, member_time, member_type, account, subscription } = JSON.parse(data.user);
            const validTime = Date.parse(member_time), curTime = new Date().getTime();
            const profile = {
                // 基础信息
                email: phone, 
                token: Token,
                grade,

                // 会员信息
                isPro: validTime > curTime,
                isSubscribe: subscription && subscription != "" || grade && grade != "",
                member_type: validTime > curTime ? member_type || "Pro" : "Free",
                member_time,
                quota: account
            }
            resolve(profile);
        } else {
            reject(res);
        }
    })
}