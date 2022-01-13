//익스프레스 서버 만들기
//Express framework
//Node.js의 http와 미들웨어인 connect 컴포넌트를 기반으로 동작
//request와 response를 제어, 가볍고 빠르고 무료임
//새로운 프로젝트 폴더를 생성

//실행
//express 설치 후 실행 -> npm install express --save

const express = require('express');
//익스프레스 객체생성
const app = express();
//기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);
//Express 서버 시작

app.get('/', (req, res)=>{ // /로 들어오면 helloworld 띄워주기
    res.send('Hello World');
});
app.listen(app.get('port'), ()=> //대기
console.log('익스프레스 서버를 시작했습니다 : '+app.get('port')));