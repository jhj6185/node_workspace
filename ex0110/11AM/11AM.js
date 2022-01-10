//promise 이어서
//비동기 처리를 다루고 싶을 때

function workP(sec){
    //Promise 인스턴스를 반환하고, then에서는 성공시 콜백함수 호출
    return new Promise((resolve, reject)=>{
        //promise 생성시 넘기는 callback
        //resolve(new Date().toISOString());
        setTimeout(()=>{
            resolve(new Date().toISOString());
    }, sec*1000);
});
}

workP(1).then((result)=>{
    console.log('first',result);
    return workP(1);
}).then((result)=>{
    console.log('second', result);
});

//promise의 catch사용
const flag = false;
const promise = new Promise((resolve, reject)=>{
    if(flag === true){
        resolve('orange');
    }else{
        reject('apple');
    }
}).then((value)=>{
    console.log(value);
}).catch((value)=>{
    console.log(value);
});// apple 출력됨

//프로세스 객체 = 프로세스 정보를 다루는 객체
//argv : 프로세스를 실행할 때 전달되는 매개변수 정보
// env : 환경변수 정보
// exit() : 프로세스를 끝내는 메소드
console.log('argv 속성의 패러미터 수 : '+process.argv.length);
console.dir(process.argv);
process.argv.forEach(function(item, index) {
    console.log(index+" : "+item);
});
