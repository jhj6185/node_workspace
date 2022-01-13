let express = require('express'),
    http = require('http'),
    path = require('path');
//Express 미들웨어 불러오기
let bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');
//오류 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
let expressSession = require('express-session')
//몽고디비 모듈 사용
let MongoClient = require('mongodb').MongoClient;
//몽구스 모듈 사용
var mongoose = require('mongoose');

// 데이터베이스 객체를 위한 변수 선언
let database;
 
// 데이터베이스 스키마 객체를 위한 변수 선언
let MemberSchema;
 
// 데이터베이스 모델 객체를 위한 변수 선언
let MemberModel;
//익스프레스 객체 생성
let app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key', resave: true, saveUninitialized: true
}));
// 데이터베이스에 연결
function connectDB(){
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/bitDB';
    
    // 데이터베이스에 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise; //mongoose의 Promise객체는 global의 Promise객체 사용하도록 함
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function(){
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
         //스키마 정의
         var MemberSchema = new mongoose.Schema({
            userId : {type: String , required:true, unique:true},
            userPwd :  {type: String , required:true},
            userName: {type: String, index:'hashed'},
            age: {type: Number,'default':-1},
            regDate: {type: Date, index:{unique:false},'default':Date.now},
            updateDate: {type: Date, index:{unique:false},'default':Date.now}
       });
        
       //스키마에 static 메소드 추가
        MemberSchema.static('findById', function(userId, callback){
            return this.find({userId:userId}, callback);
        });
        //모든 문서 데이터 반환
        MemberSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        console.log('스키마가 정의됨' );
        
        //MemberModel 정의
        MemberModel = mongoose.model("members2", MemberSchema);
        console.log('MemberModel 정의함.');
    });
    
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}
//라우팅 함수 등록
var router = express.Router();
var member=require('./member');//member 객체 불러오기
var listMember = member.listMember; //member객체에있는 함수 불러오기
var addMember = member.addMember;
var authMember = member.authMember;

//회원 리스트 조회
router.route('/process/listMember').post(function(req, res){ //이 경로로 들어오면
    console.log('/process/listMember 호출됨');
    
    if(database){
        MemberModel.findAll(function(err, results){
            if(err){
                console.log('사용자 리스트 조회중 에러 발생 : '+err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 사용자 리스트 조회중 오류 발생 </h1>');
                res.write('<p>' + err.stack + '</p');
                res.end();
                return;
            }
            
            if(results.length>0){ //결과 객체 있으면 리스트 전송 
                console.dir(results);
                listMember(results,res);    
               
            }else{
            console.log('db 연결 오류 ');
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1> DB 연결 실패</h1>');
            res.end();
            }
        });
    }
});
//사용자 추가 라우팅 함수 
router.route('/process/addMember').post(function(req,res){
    console.log('/process/addMember 호출됨');
    
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;
    
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName +',' + age);
    
    // 데이터베이스 객체가 초기화된 경우, addMember 함수 호출하여 사용자 추가
    if (database){
        var user = new MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName,"age":age});
        addMember(database,user,userId, userPwd, userName, age,function(err, addedUser){
            if(err) {throw err;}
            
            //결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
            if(addedUser){
                console.dir(addedUser);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    }else{
        // 데이터베이스 객체가 초기화되지 않는 경우 실패응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

router.route('/process/login').post(function (req, res) {
    console.log('process/login 호출됨');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember함수 호출하여 사용자 인증
    if (database) {
        authMember(database, MemberModel,userId, userPwd,
            function (err, docs) {
                if (err) {throw err;}
                //조회된 레코드가 있으면 성공 응답 전송   
                if (docs) {
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf8"
                    });
                    res.write('<h1>로그인 성공</h1>');
                    res.end();
                } else {//조회된 레코드가 없는 경우 실패 응답 전송
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf8"
                    });
                    res.write('<h1>로그인 실패</h1>');
                    res.end();
                }
            });
    } else {
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf8"
        });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
}
);
        
app.use('/', router);


//404 Error Handling
errorHandler = expressErrorHandler({
    static: { '404': './public/404.html'}
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
//서버 시작
app.listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트' + app.get('port'));
    connectDB(); //데이터베이스 연결
});