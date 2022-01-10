const calc = require('./calc.js');
//파일이 아닌 폴더를 지정하면 그 폴더안에 들어있는 index.js파일을 불러들임
console.log('모듈로 불리한 후 - calc.add함수 호출 결과 : %d', calc.add(20,20));

var calc2 = require('./calc2.js');
console.log('모듈로 분리한 후 -calc2.add 함수 호출 결과 : %d', calc2.add(10,20));