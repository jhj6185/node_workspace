//cookie-parser 다운받기 -> npm install cookie-parser --save
//URL 패러미터 사용하기
var express = require('express'), http=require('http'), path=
require('path');
var bodyParser = require('body-parser'), static = require('serve-static');
var app = express();
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use('/public',static(path.join(__dirname,'public')));//public 폴더를 /public이라는 주소창의 경로로 무조건 받겠다
//이런 뜻이랭..

var cookieParser=require('cookie-parser');

app.use(cookieParser());
//라우터 객체 참조
var router = express.Router();
//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/setUserCookie').get(function(req,res){//주소창에 쳐서 들어갈거기땜에 get으로 받아야함
    console.log('/process/setUserCookie 호출됨');

    //쿠키 설정 .. 응답 객체의 cookie 메소드 호출
    res.cookie('user',{//user : 쿠키의 이름
        id:'conan',
        name: '코난',
        authorized:true
    });
    //redirect로 응답
    res.redirect('/process/showCookie');
});
router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 호출됨');
    res.send(req.cookies); //cookies라는 속성이있음 cookie를 만들고나면 cookies라는 속성이있음
    //cookies 를 showCookie라는 페이지로 보내쥼
});

app.use('/', router) //라우터 객체를 app객체에 등록
//등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});