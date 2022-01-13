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

var listMember = require('./member_hj').listMember;
var authMember = require('./member_hj').authMember;
var addMember = require('./member_hj').addMember;

listMember(app);
authMember(app);
addMember(app);