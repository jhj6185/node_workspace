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

//라우터 객체 참조
var router = express.Router();
//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/users/:id').get(function(req,res){//주소창에 쳐서 들어갈거기땜에 get으로 받아야함
    console.log('/process/users/:id 처리함');
    //URL 파라미터 확인
    var paramId = req.params.id; //name으로는 rose가 들어옴
    console.log('/process/users와 토큰 %s를 이용해 처리함', paramId);
    
    res.writeHead('200',{'Content-Type' : 'text/html; charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write("<div><p>Param name : "+paramId+"</p></div>");

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