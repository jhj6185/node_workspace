//http모듈로 웹 서버 시작
//http 모듈을 사용하여 웹 서버 객체 생성
var http = require('http');
var server = http.createServer();
var port = 3000;
server.listen(port, function(){ //listen 은 서버를 대기시키는것
    console.log('웹 서버 시작. : %d', port);
});