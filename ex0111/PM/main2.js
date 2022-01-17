var express = require('express'), http=require('http'), path=
require('path');
var bodyParser = require('body-parser'), static = require('serve-static');
var app = express();
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use('/public',static(path.join(__dirname,'public')));//public 폴더를 /public으로 무조건 받겠다
//이런 뜻이랭..

//라우터 객체 참조
var router = express.Router();
//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/login').post(function(req,res){
    console.log('/process/login 처리함');
    var paramUserId = req.body.userId || req.query.userId;
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
    res.writeHead('200',{'Content-Type' : 'text/html; charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param id: '+paramUserId+'</p></div>');
    res.write('<div><p>Param password: '+paramUserPwd+'</p></div>');
    res.write("<br><br><a href='/public/login.html'>로그인 페이지로 돌아가기</a>");
    res.end();
})

app.use('/', router) //라우터 객체를 app객체에 등록
//등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});