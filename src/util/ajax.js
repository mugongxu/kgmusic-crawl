// 请求处理
const axios = require('axios');

const ajax = axios.create({
    timeout: 60000
});

ajax.interceptors.request.use((config) => {
    let newConf = {...config };
    // 在这里做请求头定制处理
    newConf.headers['Content-Type'] = 'application/json';
    // 缓存处理
    if (newConf.method.toLowerCase() === 'get') {
        newConf.params = Object.assign({}, (newConf.params || {}), {
            _: new Date().getTime()
        });
    }
    return newConf;
});

ajax.interceptors.response.use((response) => {
    // 在这里可以对返回做统一错误拦截
    if (response.status !== 200) {
        Promise.reject(new Error(`Http 状态异常 ${response.status}`));
    } else {
        return response;
    }
}, (error) => {
    return Promise.reject(error);
});

module.exports = ajax;
