/**
 * 验证：国内11位手机号码
 * @param {string} value 待检验手机号码
 * @returns {boolean}
 */
export function isValidMobile(value) {
    value = typeof value == 'number' ? value.toString().trim() : value.trim()
    let rule = /^1(3|4|5|7|8|9)\d{9}$/;
    return rule.test(value);
}

/**
 * 验证：大小写字母、数字及'.''_''-'字符组成的6~18位用户名
 * @param {string} value 待检验用户名
 * @returns {boolean}
 */
export function isValidUsername(value) {
    value = value.trim();
    let rule = /[a-zA-Z0-9._-]{6,18}$/;
    return rule.test(value);
}

/**
 * 验证：大小写字母、数字及'.''_''-'字符组成的6~18位密码
 * @param {string} value 待检验密码
 * @returns {boolean}
 */
export function isValidPassword(value) {
    value = value.trim();
    let rule = /[a-zA-Z0-9._-]{6,18}$/;
    return rule.test(value);
}

/**
 * 验证：中文姓名
 * @param {string} value 待检验姓名
 * @param {number} maxlen 最大姓名长度，默认：4
 * @returns {boolean}
 */
export function isValidName(value, maxlen) {
    maxlen = maxlen || 4;
    value = value.trim();
    let rule = new RegExp('^[\u4e00-\u9fa5]{2,' + maxlen + '}$');
    return rule.test(value)
}

/**
 * 验证：身份证号码（弱）
 * @param {string} value 待验证身份证号码
 * @returns {boolean}
 */
export function isValidIdentityCard(value) {
    value = typeof value == 'number' ? value.toString().trim() : value.trim();
    // var rule = /^(^[1-9]\d{5}[1-9]\d{3}(((0[2])([0|1|2][0-8])|(([0-1][1|4|6|9])([0|1|2][0-9]|[3][0]))|(((0[1|3|5|7|8])|(1[0|2]))(([0|1|2]\d)|3[0-1]))))((\d{4})|\d{3}[Xx])$)$/;
    let rule = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return rule.test(value);
}

/**
 * 验证：邮箱地址
 * @param {string} value 待验证邮箱地址
 * @returns {boolean}
 */
export function isValidEmail(value) {
    value = value.trim();
    let rule = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    return rule.test(value);
}