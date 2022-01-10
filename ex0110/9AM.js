//호이스팅 =변수의 선언과 초기화가 동시에 이루어져 값을 할당하지 않았음에도 오류가 나지않는 현상
console.log(dog);
var dog="bark";
console.log(dog);
var dog="happy";
console.log(dog);

//호이스팅 해결(let, const를 사용하여 변수를 중복선언하지 못하도록하는거)
let log;
dog="happy";
console.log(dog);
let dog="happy";

const dog = "happy";
const dog = "very happy";

//let = 재할당가능, const = 재할당 불가 (가능한 var을 let으로 사용하기)
