const car={
    name: 'beetle',
    speed: 100,
    color: 'yellow',
    start: function(){
        return this.speed+10;
    }
}

console.dir(car);

//함수 및 함수의 선언
function add(a,b){
    return a+b;
}
console.log(add(1,4));

//람다식을 이용한 함수 선언
// const lamda_add=(a,b)=>{
//     return a+b;
// }
// console.log("lamda add: "+lamda_add(2,4));

const lamda_add=(a,b)=>a+b;
console.log("lamda add : "+lamda_add(2,4));

//함수 생성시에 자신의 스코프 안에 자신을 가르키는 this와 패러미터가 담기는 arguments가 자동생성됨
// const myFunc = function(){
//     console.log(arguments);
// }
// myFunc(1,2,3,4);

//람다식 표현에는 arguments가 자동으로 생성되지 않으므로 필요한경우 ...args로 생성
const myFunc = (...args)=>{
    console.log(args);
}
myFunc(1,2,3,4);

//-비동기처리
//callback 함수 
//나중에 실행되는 코드
// A()라는 함수의 인자로 함수를 넘겨준 경우 A함수의 모든 명령들을 실행한 다음
// 마지막으로 넘겨받은 인자 callback을 실행

// setTimeout(()=>{
//     console.log('todo: first');
// },3000);

// setTimeout(()=>{
//     console.log('todo: second');
// },2000); //second실행후 first실행됨

//동기처리(순서 중요)
setTimeout(()=>{
    setTimeout(()=>{
        console.log('todo:second');
    },2000);
    console.log('todo: first');
},3000); //first가 먼저 실행되고 second가 실행됨

//****사용자 정의 함수의 동기 처리(비동기와 함꼐 익숙해져야함)
//콜백큐를 거치지 않고 동기적으로 처리됨
// 0 hello 1 출력
// function mySetTimeout(callback){
//     callback();
// }
// console.log(0);
// mySetTimeout(function(){
//     console.log('hello'); //이게 function() 이라는 콜백 함수에 의해 원래는 콜백큐로 가나봐..
//     //갔다가 돌아와서 hello를 찍어줘야하는데 동기처리는 안그러나바
// });
// console.log(1);

//****API의 비동기 처리
console.log(0);
setTimeout(function(){
    console.log('hello');
},0);
console.log(1);
//0 1 hello 출력
//콜백큐에 갔다가 돌아오는 동안 1이 출력되어버림

//promise : 보낸 요청에 대해 응답이 준비되었을 때 알림을 주는 역할
// 1초가 걸리는 작업을 first -> second -> third순으로 동작시키고 싶을 때 사용
// function work(sec, callback){
//     setTimeout(()=>{
//         callback(new Date().toISOString());
//     }, sec*1000);
// };
// work(1,(result)=>{
//     console.log('first',result);
// });
// work(1, (result)=>{
//     console.log('second', result);
// });
// work(1,(result)=>{
//     console.log('third', result);
// }) //같은 시간에 종료됨

//비동기 처리의 문제점 : 코드의 실행 순서를 확인하기 어려움
function work(sec, callback){
    setTimeout(()=>{
        callback(new Date().toISOString());
    }, sec*1000);
};
// work(1,(result)=>{
//     console.log('first',result);
//     work(1,(result)=>{
//         console.log('second', result);
//         work(1,(result)=>{
//             console.log('third', result);
//         });
//     });
// });

work(1,(result)=>{
    console.log('first', result);
    work(1, (result)=>{
        work(1, (result)=>{
            console.log('third', result);
        });
        console.log('second',result);
    });
});