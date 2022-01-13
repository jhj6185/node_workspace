//connection 이벤트와 request 이벤트 처리
var http = require('http');//http불러오기
var server = http.createServer(); //서버생성
var port= 3000;//port설정
server.listen(port, function(){
    console.log('웹 서버 시작 : %d',port);
});
server.on('connection', function(socket){
    var addr = socket.address();
    console.log('클라이언트가 접속 : %s, %d', addr.address, addr.port);
});
server.on('request',function(req,res){
    console.log('클라이언트가 요청함');
    console.dir(req);
})
//연결이되고 request에 속성들을 전부 출력함

//브라우저에 127.0.0.1:3000 치면 속성이 뜬다 로그창에