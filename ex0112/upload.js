// express-session 모듈 사용

var express = require('express'), http=require('http'), path=
require('path');
var bodyParser = require('body-parser'), static = require('serve-static');
var app = express();
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

//라우터 객체 참조
var router = express.Router();
//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/login').post(function(req,res){

  console.log('/process/login 호출됨');

   var paramUserId = req.body.userId || req.query.userId;
   var paramUserPwd = req.body.userPwd || req.query.userPwd;
   if(req.session.user){
       //이미 로그인 된 상태
       console.log('이미 로그인 되어 상품 페이지로 이동합니다.');
       res.redirect('/public/product.html');
   }else{
       //세션 저장
       req.session.user={
           id: paramUserId, name:'코난', authorized: true
       };
       res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
       res.write('<h1>로그인 성공</h1>');
       res.write('<div><p>Param id: '+paramUserId+'</p></div>');
        res.write('<div><p>Param password: '+paramUserPwd+'</p></div>');
        res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
        res.end();
   }
    
});

//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/logout').get(function(req,res){

  console.log('/process/logout 호출됨');

   if(req.session.user){
       //이미 로그인 된 상태
       console.log('로그아웃합니다');
       req.session.destroy(function(err){
           if(err){ throw err;}
           console.log('세션을 삭제하고 로그아웃 함');
           res.redirect('/public/login.html');
       })
   }else{
       //로그인 안 된 상태
       console.log('아직 로그인되어있지 않음');
       res.redirect('/public/login.html');
   }
    
});

//다른 페이지에서 세션 정보 확인
//상품 정보 확인 페이지에서 세션 정보 확인
//상품 정보 라우팅 함수
router.route('/process/product').get(function(req,res){
    console.log('/process/product 호출됨');

    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/session.html');
    }
})

//오류 페이지 보여주기
//express-error-handler 미들웨어 이용하기
//에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//404에러 페이지 처리
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.use('/', router) //라우터 객체를 app객체에 등록

app.all('*', function(req, res){//등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start');
});