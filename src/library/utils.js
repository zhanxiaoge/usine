/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Last Modified by: 展小哥
 * @Last Modified time: 2022-05-15 07:22:45
 * @Desc: 工具类
 */

// 解码链接参数
export function getDecodeUrl(name = '') {
    let result = {};
    let searchResult = window.location.search.substring(1);
    let splitResult = searchResult.split('&');
    for (let index = 0; index < splitResult.length; index++) {
        let splitValue = splitResult[index].split('=');
        if (splitValue.length !== 0 && splitValue[0].length !== 0) {
            result[splitValue[0]] = window.decodeURIComponent(splitValue[1] || '');
        }
    }
    if (name !== '' && name !== undefined && name !== null) {
        return result[name] || '';
    }
    else {
        return result;
    }
}

// 编码链接参数
export function getEncodeUrl(data = {}) {
    let result = [];
    for (let value in data) {
        if (data[value] !== '' && data[value] !== undefined && data[value] !== null) {
            result.push(`${value}=${window.encodeURIComponent(data[value])}`);
        }
    }
    return (result.length ? '?' : '') + result.join('&');
}
