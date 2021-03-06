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
//socket.io 모듈 불러들이기
var socketio = require('socket.io');
//cors 사용 - client에서 ajax로 요청하면 cors 지원
var cors = require('cors');

//mongodb 모듈 사용
let MongoClient = require('mongodb').MongoClient;
const { MongoKerberosError } = require('mongodb');

//데이터베이스 객체를 위한 변수 선언
let database;
let MemberSchema;
let MemberModel;

//스키마 모듈 불러오기
//메인 파일에서 분리된 모듈 파일을 불러온 후 사용가능
function createMemberSchema(database){
    console.log('createMemberSchema() 호출되었음');
    database.MemberSchema = require('../memberSchema.js').createSchema(mongoose);
    database.MemberModel = mongoose.model("members2", database.MemberSchema);
    //memberSchema.js 에 MemberModel을 정의해놓은게있는데 그걸 주석하기 위해
    // 여기서 선언해준것
    console.log('Schema 생성되었음');
    console.dir('Model 생성되었음');
}

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
            createMemberSchema(database);
        });
        //연결 끊어졌을 때 5초후 재연결
        database.on('disconnected',function(){
            console.log('연결이 끊어졌습니다. 5초후 재연결합니다.');
            sestInterval(connectDB, 5000);
        });
        app.set('database',database); //app이 database라는 키워드로 database 객체를 넘겨줘서
        //다른 모듈에서도 사용할 수 있게함
}

//기본 속성 설정
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
//public폴더를 static으로 오픈
app.use('/ex0117',static(path.join(__dirname,'ex0117')));//public 폴더를 /public이라는 주소창의 경로로 무조건 받겠다
//이런 뜻이랭..

var router = express.Router();

//===================================================================================================
//...
//cors를 미들웨어로 사용하도록 등록
app.use(cors());

//시작된 서버 객체를 반환
var server = app.listen(app.get('port'), function(){
    console.log('서버가 시작된 포트 : '+app.get('port'));
    connectDB();
});
//socket.io 서버를 시작
var io=socketio(server);
console.log('socket.io 요청 대기중');

//클라이언트가 연결했을 때의 이벤트 처리
io.sockets.on('connection', function(socket){
    console.log('connection info : ',socket.request.connection._peername);
    //소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가
    socket.remoteAddress = socket.request.connection._peername.address; //ip
    socket.remotePort = socket.request.connection._peername.port; //port번호

    // 'message'이벤트를 받았을 때의 처리
    socket.on('message', function(message){
        console.log('message 이벤트를 받았음');
        console.dir(message);
        if(message.recepient == 'ALL'){
            //나를 포함한 모든 클라이언트에게 메시지 전달
            console.dir('나 포함 모든 클라이언트에게 message 이벤트를 전송');
            io.sockets.emit('message', message);
        }
    });
})

app.use('/', router) //라우터 객체를 app객체에 등록

app.all('*', function(req, res){//등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})
