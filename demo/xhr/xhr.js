/* xhr.js */
function isEmptyObject(e) {
    for (let t in e)return false;
    return true;
}
function parse2query(object) {
    let str;
    if (!isEmptyObject(object)) {
        str = JSON.stringify(object);
        return '?' + str.replace(/[\"{}]/g, '').replace(/,/g, '&').replace(/:/g, '=');
    }
    return '';
}

function parseDate(xhr, resolve, reject) {
    return function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304)) {
                let _data, _header, _headerMap = {};
                if (xhr.responseText) {
                    _data = JSON.parse(xhr.responseText);
                } else {
                    _data = xhr.responseText;
                }
                _header = xhr.getAllResponseHeaders();
                _header.split(/\r\n/).forEach((item) => {
                    let _map = item.split(':');
                    _map.length > 1 && (_headerMap[_map[0]] = _map[1]);
                });
                resolve({data: _data, headers: _headerMap})
            } else {
                reject(`XHR error:${xhr.status}`);
            }
        }
    }

}

function setHeaders(xhr, headers) {
    if (!isEmptyObject(headers)) {
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key])
            }
        }
    }
}
class XHR {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.commonHeaders = {};
    }

    setCommonHeader(headers = {}) {
        this.commonHeaders = headers;
    }

    $http(method, url, data = {}, headers = {}) {
        return new Promise((resolve, reject) => {
            const xhr = this.xhr;
            let _method = method.toLowerCase();
            xhr.onreadystatechange = parseDate(xhr, resolve, reject);
            if (_method === 'get') {
                url += parse2query(data);
            }
            xhr.open(method, url, true);
            xhr.setRequestHeader('content-type', 'application/json');
            setHeaders(xhr, Object.assign({}, this.commonHeaders, headers));
            xhr.send((_method === 'get' ? null : JSON.stringify(data)));
        });
    }

    get(url, data = {}, headers = {}) {
        return this.$http('get', url, data, headers);
    }

    post(url, data, headers = {}) {
        return this.$http('post', url, data, headers);
    }
}

/* Vue插件要求提供install方法：https://cn.vuejs.org/v2/guide/plugins.html */
/*XHR.install = (Vue) => {
 Vue.prototype.$get = new XHR().get;
 Vue.prototype.$post = new XHR().post;
 };

 export default XHR;*/
const api = new XHR();
api.setCommonHeader({
    "CA-Token": '3413]39DD6B48F926B7810001015D15AFB287]1]5]1]1',
    "Client-Flag": 1
});
api.post('http://10.12.10.20:8080/CACoreV2/v2/user/getusertreeapi', {
    "roleid": 1,
    "userid": 1,
    "usertype": 5,
    "nusertype": 0,
    "companyid": 2,
    "aaid": "-1",
    "ppid": "1"
}).then(function (res) {
    console.dir(res);
});
