//express 기본 모듈 불러오기
var express = require('express'), http=require('http'), path=
require('path');
//express의 미들웨어 불러오기
let bodyParser = require('body-parser'), 
cookieParser = require('cookie-parser'),
static = require('serve-static'),
errorHandler = require('errorhandler');
var mongoose = require('mongoose');
//에러 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
var expressSession = require('express-session');
//익스프레스 객체 생성
let app = express();
//mongodb 모듈 사용
let MongoClient = require('mongodb').MongoClient;
const { MongoKerberosError } = require('mongodb');

//데이터베이스 객체를 위한 변수 선언
let database;
let MemberSchema;
let MemberModel;

//데이터베이스에 연결
function connectDB(){
    // 데이터 베이스 연결 정보
    let databaseUrl = 'mongodb://localhost:27017/bitDB';
    //데이터베이스 연결
        console.log('데이터베이스에 연결을 시도합니다.');
        mongoose.Promise = global.Promise; //mongoose의 promise 객체는 
        //global의 promise객체 사용하도록 함
        mongoose.connect(databaseUrl);
        database=mongoose.connection;
        database.on('error',console.error.bind(console, 'mongoose connection error.'));  
        
        database.on('open', function(){
            console.log('데이터베이스에 연결되었습니다. : '+databaseUrl);
            //스키마 정의
            MemberSchema = mongoose.Schema({
                userId:{ type : String, required: true, unique: true},
                userPwd: { type : String, required: true },
                userName: { type : String, index: 'hashed' },
                age: {type:Number, 'default' : -1},
                // age: {type:Number},
                regDate : { type: Date, index : { unique : false }, 'default': Date.now},
                updateDate : { type: Date, index: { unique : false }, 'default': Date.now}
            });

            //스키마에 static 메소드 추가
            MemberSchema.static('findById', function(userId, callback){
                return this.find({ userId : userId }, callback);
            });
            MemberSchema.static('findAll', function(callback){
                return this.find({}, callback);
            });

            console.log('MemberSchema 정의함');
            //MemberModel 모델 정의
            MemberModel = mongoose.model("members2", MemberSchema); //members2라는 컬렉션이
            //db에있다면 그것을 그대로 사용하기 위해 짝을 지어주고, 없으면 만들어서 사용해주는 기능
            console.log('MemberModel 정의함');
        });
        //연결 끊어졌을 때 5초후 재연결
        database.on('disconnected',function(){
            console.log('연결이 끊어졌습니다. 5초후 재연결합니다.');
            sestInterval(connectDB, 5000);
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

var router = express.Router();

var printListMember = require('./member').printListMember;
var authMember = require('./member').authMember;
var addMember = require('./member').addMember;
var listMember = require('./member').listMember;


//========================회원리스트 조회===================================================
router.route('/process/listMember').post(function(req,res){
    console.log('/process/listMember 호출됨');
    if(database){
        // 1. 모든 사용자 검색
        listMember(database, MemberModel,function(err,results){
            if(err){
                console.error('사용자 리스트 조회 중 오류 발생 : '+err.stack);
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                return;
            }
            if(results){
                //결과 객체 있으면 리스트 전송 
                console.dir(results);
                printListMember(results,res); //results와 res를 안보내주면 
                //member_hj.js에서 results가 정의되어있지않다고 뜸
            }else{
                //결과 객체 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2> 사용자 리스트 조회 실패</h2>');
                res.end();
            }
        }); //findAll end
    }
})

//==========================================로그인======================================
router.route('/process/login').post(function(req,res){

    console.log('/process/login 호출됨');
      //요청 파라미터 확인
     var userId = req.body.userId || req.query.userId;
     var userPwd = req.body.userPwd || req.query.userPwd;
     
     //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
     if(database){
         authMember(database,MemberModel,userId,userPwd, function(err, docs){
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

//==================================회원가입============================================
router.route('/process/addMember').post(function(req,res){
    
    console.log('/process/addMember 호출됨');
      //요청 파라미터 확인
     var userId = req.body.userId || req.query.userId;
     var userPwd = req.body.userPwd || req.query.userPwd;
    var userName= req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;

     console.log('요청 파라미터 : '+userId+','+userPwd+','+userName+','+age);
     //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
     if(database){
         addMember(database,MemberModel,userId,userPwd,userName,age, function(err, addedUser){ //result는 
            //addMember에 올라가면 result를 callback(null, result);로 해주고있어서
            // 그 result가 여기의 result인데 어떤 데이터를 insert하게되면,
            //result객체에 몇개의 데이터가 삽입됐는지 뜨고, 어떤 데이터가 삽입되었는지 
            //result에 대한 정보가 쫙 들어있는데 그거가 있고, insertedCount가 0보다 큰지
            //이런거로 확인해주는 것...(근데 playground result에는 result의 아이디값만 뜸..)
             if(err){
                 throw err;
             }
             //추가된 데이터가 있으면 성공 응답 전송
             if(addedUser){
                 console.dir(addedUser);
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

  //===========================================================================================
app.use('/', router) //라우터 객체를 app객체에 등록

app.all('*', function(req, res){//등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : '+app.get('port'));
    //데이터베이스 연결을 위한 함수 호출
    connectDB();
});