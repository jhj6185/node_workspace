console.log('aaaa');
console.log('json 객체 보여주기 : %j', {name : '코난'});
console.log('문자열 보여주기 : %s', '안녕!');
console.log('숫자 보여주기 : %d', 10);

//console 객체의 주요 메소드
//dir(object) 자바스크립트 객체의 속성들을 출력
var result = 0;
console.time('elapsedTime');
for(var i=1; i<=100; i++){
    result+=i;
}
console.timeEnd('elapsedTime');
console.log('1부터 100까지 합 : %d', result);

//실행한 파일 이름과 객체 정보 출력
console.log('현재 실행한 파일의 이름 : %s', __filename);
console.log('현재 실행한 파일의 path: %s',__dirname);
var Person = {name:'conan',age: 10};
console.dir(Person);