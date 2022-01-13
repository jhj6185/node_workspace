//connection -연결됨
//request 가들어오면 response
//close - 연결종료

//스트림으로 읽어 응답 보내기
//createReadStream으로 읽은 후 pipe() 메소드를 이용해 전송
var http = require('http');//http불러오기
var server = http.createServer(); //서버생성
var fs = require('fs');

var host='192.168.0.16';
var port= 3000;//port설정
server.listen(port,host,'50000',function(){ //50밀리세컨즈 동안 응답이없으면 오류를 발생시킨다던지 하는것(응답대기시간)
    console.log('웹 서버 시작 : %s, %d',host,port);
});

server.on('request',function(req,res){
    console.log('클라이언트 요청');
    var filename= 'conan.jpg';
    var infile= fs.createReadStream(filename, {flags:'r'});
    infile.pipe(res);
});