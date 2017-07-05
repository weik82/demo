/* xhr.js */
function isEmptyObject(e) {
    for (let t in e)return false;
    return true;
}
function parse2query(object) {
    let str = '';
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
                let _data, _header;
                if (xhr.responseText) {
                    _data = JSON.parse(xhr.responseText);
                } else {
                    _data = xhr.responseText;
                }
                _header = xhr.getAllResponseHeaders();
                resolve({data: _data, headers: _header})
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
console.log(parse2query({id: 1, name: 'kk'}));
class XHR {
    get(url, data = {}, headers = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = parseDate(xhr, resolve, reject);
            url += parse2query(data);
            xhr.open('get', url, true);
            xhr.setRequestHeader('content-type', 'application/json');
            setHeaders(xhr, headers);
            xhr.send(null);
        });
    }

    post(url, data, headers = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = parseDate(xhr, resolve, reject);
            xhr.open('post', url, true);
            xhr.setRequestHeader('content-type', 'application/json');
            setHeaders(xhr, headers);
            xhr.send(JSON.stringify(data));
        });
    }
}

/* Vue插件要求提供install方法：https://cn.vuejs.org/v2/guide/plugins.html */
/*XHR.install = (Vue) => {
 Vue.prototype.$get = new XHR().get;
 Vue.prototype.$post = new XHR().post;
 };

 export default XHR;*/
const ajax = new XHR();
ajax.post('http://10.12.10.20:8080/CACoreV2/v2/user/loginapi', {
    "username": "bj@admin",
    "userpassword": "c4ca4238a0b923820dcc509a6f75849b"
}).then(function (res) {
    console.log(res);
});
