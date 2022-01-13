//헤더/요청 파라미터 확인
//query : 클라이언트에서 get방식으로 전송한 요청 파라미터 확인
//body : 클라이언트에서 post 방식으로 전송한 요청 파라미터 확인
// 단, body-parser와 같은 외장 모듈을 사용해야 함. ex) req.body.name
// header(name) : 헤더 확인
let express = require('express'), http = require('http');
let app = express();

app.use(function (req, res, next){
    console.log('첫 번째 미들웨어에서 요청처리중');
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name; // ?name=으로 들어오는 것을 paramName으로 받겠다
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>User-Agent : '+userAgent+'</p></div>');
    res.write('<div><p>Param name : '+paramName+'</p></div>');
    res.end();
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});