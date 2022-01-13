//클라이언트에게 응답 보내기
//request 이벤트 처리할 때 writeHead(), write(), end() 메소드로 응답 전송
var http = require('http');//http불러오기
var server = http.createServer(); //서버생성
var port= 3000;//port설정

server.listen(port, function(){
    console.log('웹 서버 시작 : %d',port);
});
server.on('request', function(req, res){
    console.log('클라이언트 요청');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>응답 페이지</title>");
    res.write("<body>");
    res.write("<h1>노드제이에스로부터의 응답 페이지</h1>");
    res.write("</body>");
    res.write("</html>");
    res.end();

})
//브라우저에서 http://127.0.0.1:3000 치면 페이지가 보임