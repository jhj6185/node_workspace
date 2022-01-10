const nconf=require('nconf');
nconf.env();
console.log('OS 환경 변수의 값 : %s',
nconf.get('OS')); //Windows_NT 출력됨

const os=require('os');
console.log('시스템의 hostname : %s', os.hostname());
console.log('시스템의 메모리 : %d / %d', os.freemem(), os.totalmem());
console.log('시스템의 CPU 정보\n');
console.dir(os.cpus());
console.log('시스템의 네트워크 인터페이스 정보\n');
console.dir(os.networkInterfaces());

var path=require('path');
//디렉터리 이름 합치기
var directories = ["users", "mike", "docs"];
var docsDirectory = directories.join(path.sep);
console.log('문서 디렉터리 : %s', docsDirectory);
//디렉터리 이름과 파일이름 합치기
var curPath=path.join('/Users/mike', 'notepad.exe');
console.log('파일 패스 : %s',curPath);

var path=require('path');
//패스에서 디렉터리, 파일 이름, 확장자 구별하기
var filename="C:\\Users\\mike\\notepad.exe";
var dirname=path.dirname(filename);
var basename=path.basename(filename);
var extname=path.extname(filename);
console.log('디렉터리 : %s, 파일이름 : %s, 확장자 : %s', dirname,basename,extname);

//url 모듈의 주요 메소드
//parse와 format 사용
//parse() : 주소 문자열을 파싱하여 url객체 생성
// format() : url객체를 주소 문자열로 변환
var url = require('url');
var curURL = url.parse('https://m.search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=자바스크립트');
var curStr=url.format(curURL);
console.log('주소 문자열 : %s', curStr);
console.dir(curURL);

//querystring 모듈
// &기호로 구분되는 요청 파라미터를 분리하는데 사용
//require 메소드로 모듈을 불러온 후 parse와 stringify 메소드 사용
var querystring = require('querystring');
var param = querystring.parse(curURL.query);
console.log('요청 query중 파라미터의 값 : %s', param.query);
console.log('원본 요청 파라미터 : %s', querystring.stringify(param));

//이벤트 보내고 받기
//on으로 리스너 등록, emit으로 이벤트 전송
//on(event, listener) : 지정한 이벤트의 리스너를 추가함
//once(event,listener) : 지정한 이벤트의 리스너를 추가하지만 한 번 실행한 후 에 자동으로 리스너가 제거
//removeListener(event, listener) : 지정한 이벤트에 대한 리스너를 제거
// emit(event, param) : 이벤트를 전송
process.on('tick', function(count){
    console.log('tick 이벤트 발생함 : %s', count);
});
setTimeout(function(){
    console.log('2초 후에 tick 이벤트 전달 시도함');
    process.emit('tick', '2');
},2000);