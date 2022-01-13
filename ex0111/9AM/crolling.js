//다른 웹사이트의 데이터 가져오기1
//http 모듈을 사용해 다른 웹사이트의 데이터를 가져와서 필요한 곳에 사용할 수 잇음
// 실행결과를 복사해서 html파일에 붙여넣은 후 열어보기 -> google.html
const http=require('http');
const options={
    host: 'www.google.com',
    port: 80,
    path: '/'
};
const req = http.get(options, function(res){ //get방식을 통해 데이터 요청
    let resData = '';
    res.on('data', function(chunk){
        resData+=chunk;
    });
    res.on('end', function(){ //콜백함수
        console.log(resData);
    });
});
req.on('error', function(err){
    console.log("오류 발생"+err.message);
});