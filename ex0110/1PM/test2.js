//계산기 객체를 모듈로 구성
//계산기 객체가 EventEmitter를 상속하면 emit과 on 메소드 사용 가능
var Calc = require('./calc3');
var calc=new Calc();
calc.emit('stop');
console.log(Calc.title+'에 stop 이벤트 전달함.');