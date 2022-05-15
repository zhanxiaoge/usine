/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Last Modified by: 展小哥
 * @Last Modified time: 2022-05-15 07:22:36
 * @Desc: 数据存储
 */

export default {
    // 本地存储 - 获取
    getStorage(name = '', type = 'local') {
        if (name !== '' && name !== undefined && name !== null) {
            if (this.isSupport()) {
                let value = window[`${type}Storage`].getItem(name);
                if (value !== '' && value !== undefined && value !== null) {
                    return JSON.parse(value);
                }
            }
            else {
                return this.getCookie(name);
            }
        }
        return '';
    },
    // 本地存储 - 设置
    setStorage(name = '', value = '', type = 'local') {
        if (name !== '' && name !== undefined && name !== null) {
            if (value !== '' && value !== undefined && value !== null) {
                if (this.isSupport()) {
                    window[`${type}Storage`].setItem(name, JSON.stringify(value));
                }
                else {
                    this.setCookie(name, value, 365);
                }
            }
            else {
                if (this.isSupport()) {
                    window[`${type}Storage`].removeItem(name);
                }
                else {
                    this.setCookie(name, value, 0);
                }
            }
        }
        return value;
    },
    // Cookie存储 - 获取
    getCookie(name = '') {
        if (name !== '' && name !== undefined && name !== null) {
            let result = window.document.cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`);
            if (result !== '' && result !== undefined && result !== null && result.length !== 0) {
                let value = result.pop();
                if (value !== '' && value !== undefined && value !== null) {
                    value = window.decodeURIComponent(value);
                    try {
                        return JSON.parse(value);
                    }
                    catch (error) {
                        return value;
                    }
                }
            }
        }
        return '';
    },
    // Cookie存储 - 设置
    setCookie(name = '', value = '', time = 7) {
        if (name !== '' && name !== undefined && name !== null) {
            let currentTime = new Date();
            let expiresTime = currentTime.setTime(currentTime.getTime() + ~~(time) * 24 * 60 * 60 * 1000);
            let cookiesData = window.encodeURIComponent(JSON.stringify(value));
            window.document.cookie = `${name}=${cookiesData};expires=${new Date(expiresTime).toUTCString()}`;
        }
        return value;
    },
    // 是否支持存储数据
    isSupport() {
        try {
            window.localStorage.setItem('isSupportStorage', true);
            window.localStorage.removeItem('isSupportStorage');
            return (/\{\s*\[native code\]\s*\}/).test(`${window.localStorage.setItem}`);
        }
        catch (error) {
            return false;
        }
    },
};
