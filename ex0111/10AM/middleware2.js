//여러개의 미들웨어 사용하기
// app객체를 생성 후 listen()
// use 메소드를 이용해 응답을 위한 미들웨어를 등록
// use -> next, use ->next , use->next =>get -> 클라이언트 응답
let express = require('express'), http = require('http');
let app = express();

app.use(function( req, res, next){
    console.log("첫 번째 미들 웨어에서 요청 처리");
    req.user= 'conan';
    next(); //next 호출로 두번째 미들웨어인 use로 감
})
app.use('/', function(req,res,next){
    console.log('두번째 미들웨어에서 요청 처리');
    res.writeHead('200', { 'Content-Type' : 'text/html; charset=utf8'});
    res.end('<h1>Express 서버에서 '+req.user+'가 응답중</h1>');
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});