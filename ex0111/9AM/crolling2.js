//다른 웹사이트의 데이터 가져오기2
//post 방식으로 요청할때는 request() 메소드 사용
//실행 결과를 html 파일로 생성해서 열어보기

let http=require('http');
let opts = {
    host:'www.google.com',
    port: 80,
    method: 'POST',
    path: '/',
    headers: {}
};
let resData = '';
let req = http.request(opts, function(res){
    //응답 처리
    res.on('data', function(chunk){
        resData+=chunk;
    });

    res.on('end', function(){
        console.log(resData);
    });
});

//post 방식으로 요청시에는 헤더 작성 필요
opts.headers['Content-Type']='application/x-www-form-urlencoded';
req.data="q=actor";
opts.headers['Content-Length']=
req.data.length;

req.on('error', function(err){
    console.log("에러 발생 : "+err.message);
});
//요청 전송
req.write(req.data);
req.end();

