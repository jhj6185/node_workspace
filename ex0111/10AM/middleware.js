//미들웨어 만들기 예제
// app객체를 생성 후 listen()
// use 메소드를 이용해 응답을 위한 미들웨어를 등록
// use -> next, use ->next , use->next =>get -> 클라이언트 응답
let express = require('express'), http = require('http');
let app = express();

// ***** 하나씩 use 호출 해보기
// app.use(function (req, res, next){
//     console.log('첫 번째 미들웨어에서 요청을 처리함.');
//     res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
//     res.end('<h1>Express 서버 응답 </h1>');
// });

// 요청 객체와 응답 객체
// app.use(function(req, res, next){
//     console.log('첫번째 미들웨어에서 요청 처리');
//     res.send({ name : '코난', age: 10});
// });

app.use(function( req, res, next){
    console.log("첫 번째 미들 웨어에서 요청 처리");
    res.redirect("http://google.co.kr");
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});



