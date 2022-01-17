// body-parser 사용하기
//body-parser
//post로 요청했을 때의 요청 패러미터 확인 방법 제공

var express = require('express'), http=require('http'), path=
require('path');
var bodyParser = require('body-parser'), static = require('serve-static');
var app = express();
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use(static(path.join(__dirname,'public')));

//미들웨어에서 파라미터 확인
app.use(function (req,res,next){
    console.log('첫번째 미들웨어에서 요청을 처리함');
    var paramUserId = req.body.userId || req.query.userId; //query 는 get방식, body는 post방식이라고 이해하면 편하긴 한데
    //사실 정확히말하면 그건 아니고...
    //body는 data가 들어온 모든것이 body로 들어오는데 그게 body고 query는 주소창에 url치는거 래..
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param id: '+paramUserId+'</p></div>');
    res.write('<div><p>Param password: '+paramUserPwd+'</p></div>');
    res.end();
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});