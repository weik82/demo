let fs = require('fs'),
    superAgent = require('superagent'),
    async = require('async'),
    cheerio = require('cheerio');
let path = './pic/';
function getPageUrl(url) {
    superAgent.get(url)
        .end(function (err, res) {
            if (err) throw err;
            let picUrls = [],
                $ = cheerio.load(res.text),
                current_page = $('.current-comment-page').html(),
                previous_page_url = $('.previous-comment-page').attr('href');
            $('.view_img_link').each(function (index, element) {
                let $element = $(element);
                let href = 'http:' + $element.attr('href'),
                    hrefArray = href.split('/'),
                    title = hrefArray[hrefArray.length - 1];
                picUrls.push({
                    title: title,
                    href: href
                });
            });
            async.mapLimit(picUrls, 5, function (url, callback) {
                downPic(url, callback);
            }, function (err, result) {
                if (err) throw err;
                console.log('*********' + current_page + '页下载成功**********');
                if (previous_page_url) {
                    getPageUrl(previous_page_url);
                }
            });
        });
}
function downPic(url, callback) {
    superAgent.get(url.href)
        .end(function (err, res) {
            if (err) throw err;
            fs.re
            fs.writeFile(path + url.title, res.body, function (error) {
                if (error) throw error;
                console.log(url.title + '下载成功!');
                callback(null, {})
            })
        })
}
getPageUrl('http://jandan.net/ooxx');