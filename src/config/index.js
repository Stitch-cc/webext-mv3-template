const config = {
    // 基础配置
    name: "IG Export - Export Instagram Followers",
    description: "A chrome extension made for people who want to export followers and following from Instagram into csv.",
    version: "1.3.0",

    // 谷歌认证配置
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs1KkA52w7Oc2J8Jhi7jf4yl3M6ywVj5fA4jLDM6+4GVrx6B6Q0n/sIJmRgnHve+NDdzVI2su+v0s0907Y3r10ZcwPHVaJVGUUWhNZeMc5dhLMh5/JOoYrTS5h/eroHvjwca0qIupKEcdtGzniaKLxeL91VyabCSzkgJJh5+BHYeJNUueQpEbWYbJwFWCkfQpZwzG5thGRwa/cf0cK3r17JMHxJJsJ0P1HTmLyXQILsWceevon1XP7+p8OJkJ9AWhotmnDBH121x9Ug/RIdqo/eBVp+hBzEOwPCPZMAJHgX/poA3PklCr3tl2yzQA2kT6ccq23/FQZvcP6PuBbqzqKQIDAQAB",
    oauth2: {
        "client_id": "695891906885-mjb19vbpj9kibbtm5lalth50ptv5mnpe.apps.googleusercontent.com",
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
    },
    host_permissions: [
        "*://*.instagram.com/*"
    ],
    permissions: [
        "cookies",
        "storage",
        "identity"
    ]
}

export const extContentConfig = {
    simple_name: 'IG Export',
    FAQs_page: 'https://baidu.com/',
    service_email: 'IG_Export@savemydayapp.com',
    agreement_url: 'https://oneclickbooster.com/terms-of-service/'
}



export const getSimpleName = () => {
    return config.name.split("-")[0].trim();
}

export default config;