// load modules
var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
const sanitizeHtml = require('sanitize-html');
var qs = require('querystring');

// route, routing
// 접속한 페이지가 메인 홈페이지인 경우
app.get('/', function (request, response) {
    /*
      첫번째 인자로 파일 목록을 읽을 폴더를 가져오고,
      콜백함수의 두번째 인자로 폴더의 파일목록을 가져옴
    */
    fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
        response.send(html);
    })
})

// 메인 홈페이지가 아닌 경우
app.get('/page/:pageId', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(`${request.params.pageId}`).base;

        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
            var title = filteredId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `<a href="/create">create</a>
                 <a href="/update?id=${sanitizedTitle}">update</a>
                 <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                 </form>
                `);
            response.send(html);
        })
    })
})

// create 버튼을 클릭한 경우
app.get('/create', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description" cols=120 rows=5></textarea></p>
            <p><input type="submit"></p>
        </form>
        `, '');
        response.send(html);
    })
})

// /create 페이지에서 제출 버튼을 클릭한 경우
app.post('/create_process', function (request, response) {
    var body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        fs.writeFile(`data/${title}`, description, function (err) {
            response.writeHead(302, {   // 302 : 페이지 리다이렉션
                location: `/?id=${title}`
            });
            response.end();
        });
    });
})

// listen
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})