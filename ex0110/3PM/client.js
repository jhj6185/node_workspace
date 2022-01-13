//클라이언트 요청시 발생하는 이벤트 처리
//웹 브라우저에서 요청할 때 상황에 따른 적절한 이벤트 발생
var http = require('http');//http불러오기
var server = http.createServer(); //서버생성

var host='192.168.0.16';
var port= 3000;//port설정
server.listen(port,host,'50000',function(){ //50밀리세컨즈 동안 응답이없으면 오류를 발생시킨다던지 하는것(응답대기시간)
    console.log('웹 서버 시작 : %s, %d',host,port);
});