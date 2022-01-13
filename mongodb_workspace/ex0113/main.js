//module.exports에 함수 할당하기
//함수를 할당한 후 메인 파일에서 그 함수를 실행할 수 있음

//require() 메소드는 exports 객체를 반환함
var member4 = require('./member4');
var printMember = require('./member5').printMember; // .을 찍으면 require된 애에 있는 함수를
//호출 할 수 있음
printMember();

var member6 = require('./member6');
member6.printMember();

var Member7 = require('./member7');
var member7 = new Member7('conan','코난');
member7.printMember();

function showMember(){
    // return member1.getMember().userName+','+member1.group.userName;
    return member4().userName+','+'no group';
}
console.log('사용자 정보 : %s', showMember());

