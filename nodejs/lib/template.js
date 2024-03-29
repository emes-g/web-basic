module.exports = {
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
    
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            <script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
    
        </html>
        `
    },
    list: function (filelist) {
        var list = '<ul>';
        for (var i = 0; i < filelist.length; i++)
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        list += '</ul>';
        return list;
    }
}