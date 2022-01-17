//express 기본 모듈 불러오기
var express = require('express'), http=require('http'), path=
require('path');
//express의 미들웨어 불러오기
let bodyParser = require('body-parser'), 
cookieParser = require('cookie-parser'),
static = require('serve-static'),
errorHandler = require('errorhandler');
//에러 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
var expressSession = require('express-session');
//익스프레스 객체 생성
let app = express();
//mongodb 모듈 사용
let MongoClient = require('mongodb').MongoClient;
//데이터베이스 객체를 위한 변수 선언
let database;
//데이터베이스에 연결
function connectDB(){
    // 데이터 베이스 연결 정보
    let databaseUrl = 'mongodb://localhost:27017/';
    //데이터베이스 연결
    MongoClient.connect(databaseUrl, function(err, client){
        database = client.db('bitDB');
        if(err) throw err;
        console.log('데이터베이스에 연결되었습니다..'+databaseUrl);
    });
}

//기본 속성 설정
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
//public폴더를 static으로 오픈
app.use('/public',static(path.join(__dirname,'public')));//public 폴더를 /public이라는 주소창의 경로로 무조건 받겠다
//이런 뜻이랭..

//==============================로그인 기능 추가======================
//사용자를 인증하는 함수
var authMember = function(database, userId, userPwd, callback){
    console.log('authMember 호출됨 : '+userId+','+userPwd);
    //Members컬렉션 참조
    var members = database.collection('Members');
    members.find({"userId": userId, "userPwd": userPwd}).toArray(function(err, docs)
    {
        if(err){
            //에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
            callback(err,null);
            return;
        }
        if(docs.length>0){
            //조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
            console.log('아이디[%s],패스워드[%s]가 일치하는 사용자 찾음',
            userId, userPwd);
            callback(null, docs);
        }else{
            //조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
            console.log("일치하는 사용자를 찾지 못함");
            callback(null,null);
        }
    }
    )
}
//===========================회원가입 기능 만들기===============================
//회원가입을 위한 함수
var addMember = function(database, userId, userPwd, callback){
    console.log('addMember 호출 : '+userId+","+userPwd);
    var members = database.collection('Members');
    members.insertMany([{ "userId" : userId, "userPwd": userPwd }], function(err, result){
        if(err){
            //오류 발생시 콜백함수가 호출되어 오류객체 전달
            callback(err,null);
            return;
        }
        if(result.insertedCount>0){
            console.log("사용자 레코드 추가됨 : "+result.insertedCount);
        }else{
            console.log("추가되지 않았음");
        }
        callback(null, result);
    });
}
//================================회원정보 수정 기능=========================
var updateMember = function(database, userId, userPwd, callback){
    console.log('updateMember 호출 : '+userId+","+userPwd);
    var members = database.collection('Members');
    members.updateMany({ "userId": userId },{ $set: {"userPwd": userPwd }}, function(err, result){
        if(err){
            //오류 발생시 콜백함수가 호출되어 오류객체 전달
            callback(err,null);
            return;
        }
        if(result.modifiedCount>0){
            console.log("사용자 레코드 수정됨 : "+result.modifiedCount);
        }else{
            console.log("추가되지 않았음");
        }
        callback(null, result);
    });
}

//=============================라우팅 함수 추가==========================
//라우터 객체 참조
var router = express.Router();
//라우팅 함수 등록(/process/login 으로 들어오는 요청을 받는애)
router.route('/process/login').post(function(req,res){

  console.log('/process/login 호출됨');
    //요청 파라미터 확인
   var userId = req.body.userId || req.query.userId;
   var userPwd = req.body.userPwd || req.query.userPwd;
   console.log('요청 파라미터 : '+userId+','+userPwd);
   //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
   if(database){
       authMember(database,userId,userPwd, function(err, docs){
           if(err){
               throw err;
           }
           //조회된 레코드가 있으면 성공 응답 전송
           if(docs){
               res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
               res.write('<h1>로그인 성공</h1>');
               res.end();
           } else{
               //조회된 레코드가 없는 경우 실패 응답 전송
               res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
               res.write('<h1>로그인 실패</h1>');
               res.end();
           }
       });
   }else{
       res.writeHead('200', { 'Content-Type':'text/html;charset=utf8'});
       res.write('<h2>데이터베이스 연결 실패</h2>');
       res.end();
   }
    
});
//회원가입기능
router.route('/process/addMember').post(function(req,res){
    
    console.log('/process/addMember 호출됨');
      //요청 파라미터 확인
     var userId = req.body.userId || req.query.userId;
     var userPwd = req.body.userPwd || req.query.userPwd;
     console.log('요청 파라미터 : '+userId+','+userPwd);
     //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
     if(database){
         addMember(database,userId,userPwd, function(err, result){ //result는 
            //addMember에 올라가면 result를 callback(null, result);로 해주고있어서
            // 그 result가 여기의 result인데 어떤 데이터를 insert하게되면,
            //result객체에 몇개의 데이터가 삽입됐는지 뜨고, 어떤 데이터가 삽입되었는지 
            //result에 대한 정보가 쫙 들어있는데 그거가 있고, insertedCount가 0보다 큰지
            //이런거로 확인해주는 것...(근데 playground result에는 result의 아이디값만 뜸..)
             if(err){
                 throw err;
             }
             //추가된 데이터가 있으면 성공 응답 전송
             if(result&&result.insertedCount>0){
                 console.dir(result);
                 res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                 res.write('<h1>회원가입 성공</h1>');
                 res.end();
             } else{
                 //결과 객체가 없으면 실패 응답 전송
                 res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                 res.write('<h1>회원가입 실패</h1>');
                 res.end();
             }
         });
     }else{ //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
         res.writeHead('200', { 'Content-Type':'text/html;charset=utf8'});
         res.write('<h2>데이터베이스 연결 실패</h2>');
         res.end();
     }
      
  });
  //회원정보 수정 기능
  router.route('/process/updateMember').post(function(req,res){

    console.log('/process/updateMember 호출됨');
      //요청 파라미터 확인
     var userId = req.body.userId || req.query.userId;
     var userPwd = req.body.userPwd || req.query.userPwd;
     console.log('요청 파라미터 : '+userId+','+userPwd);
     //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
     if(database){
         updateMember(database,userId,userPwd, function(err, result){
             if(err){
                 throw err;
             }
             //조회된 레코드가 있으면 성공 응답 전송
             if(result){
                 res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                 res.write('<h1>회원정보 수정 성공</h1>');
                 res.end();
             } else{
                 //조회된 레코드가 없는 경우 실패 응답 전송
                 res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                 res.write('<h1>회원정보 수정 실패</h1>');
                 res.end();
             }
         });
     }else{
         res.writeHead('200', { 'Content-Type':'text/html;charset=utf8'});
         res.write('<h2>데이터베이스 연결 실패</h2>');
         res.end();
     }
      
  });
//============================================================================
app.use('/', router) //라우터 객체를 app객체에 등록

app.all('*', function(req, res){//등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : '+app.get('port'));
    //데이터베이스 연결을 위한 함수 호출
    connectDB();
});