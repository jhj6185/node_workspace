//**** 내부 함수가 외부 함수의 스코프에 접근할 수 잇음
// 스코프는 {} 이거임
// outer()의 실행이 끝난 이후에도 inner()함수가 outer() 함수의 스코프에 접근 가능
function outer(){
    var a='AA';
    var b='BB';
    function inner(){
        var a='aa';
        console.log(a); //aa
        console.log("from inner : "+b); // BB  
    }
    return inner;
}
var outerFunc=outer(); //outer() 의 return 값인 inner
outerFunc(); //inner()실행