var fs = require('fs');
var http = require('http');//http불러오기
var server = http.createServer(); //서버생성
var port= 3000;//port설정

server.listen(port, function(){
    console.log('웹 서버 시작 : %d',port);
});
server.on('request', function(req, res){
    console.log('클라이언트 요청');
    var filename= 'conan.jpg';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, { "Content-Type":"image/jpg"});
        res.write(data);
        res.end();
    });
}); //request