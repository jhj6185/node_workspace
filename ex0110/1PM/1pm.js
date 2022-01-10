//노드의 파일 시스템
//동기식 io와 비동기식 io모두 제공
//동기식 io는 파일 작업이 끝날때까지 대기
//동기식 io메소드에서는 Sync라는 단어가 붙음**
// var fs = require('fs');
// var data = fs.readFileSync('../../package.json', 'utf-8');
// console.log(data);

//비동기식으로 파일 읽기
//readFile메소드 사용하면서 콜백함수를 파라미터로 전달
//readFile로 읽고 writeFile로 쓰기
// var fs= require('fs');
// fs.readFile('../../package.json','utf8',function(err,data){
//     console.log(data);
// });
// console.log('프로젝트 폴더 안의 package.json파일 읽기');

//비동기식으로 파일 쓰기
// var fs= require('fs');
// fs.writeFile('./output.txt','Hello World!', function(err){
//     if(err){
//         console.log('Error : '+err);
//     }
//     console.log('output.txt 파일에 데이터 쓰기 완료'); //Hello World! 가 output.txt에 써졋음
// })

//파일 열기, 닫기, 읽기 & 쓰기
// open(path, flags [,mode][,callback]) : 파일을 열기 **flag란? r 읽기 w쓰기 w+ 읽고쓰기 a+(append)읽고 추가에 사용
// read(fd, buffer, offset, length, position [, callback]) : 지정한 부분의 파일 내용을 읽어들임
// write(fd, buffer, offset, length, position [, callback]) : 파일의 지정한 부분에 데이터를 씀
// close(fd [,callback])
// const fs= require('fs');
// fs.open('./output.txt', 'w', function(err, fd){
//     if(err) throw err;
//     const buf = Buffer.from('안녕!\n','utf-8' );
//     fs.write(fd, buf, 0 , buf.length, null, function(err, written, buffer){
//         if(err) throw err;
//         console.log(err, written, buffer);
//         fs.close(fd, function(){
//             console.log('파일 열고 데이터 쓰고 파일 닫기 완료');
//         });
//     });
// });

//파일 직접 열고 읽기
//open으로 열고 read로 읽기, 버퍼사용
//플래그 r : 읽기에 사용, 파일이 없는 경우 예외 발생
// w : 쓰기에 사용, 파일이 없으면 생성하고 파일이 있으면 이전 내용 삭제
// w+ : 읽고쓰기에 사용, 파일이 없으면 생성하고, 파일이 있으면 이전 내용 삭제
// a+ : 읽고 추가에 사용, 파일이 없으면 생성하고 파일이 있으면 이전 내용에 추가
var fs= require('fs');
fs.open('./output.txt', 'r', function(err, fd){
    if(err) throw err;
    var buf = Buffer.alloc(20); //20칸 뽑겠다는 거구만
    console.log('버퍼 타입 : %s', Buffer.isBuffer(buf));
    fs.read(fd, buf, 0,buf.length,null, function(err, bytesRead,buffer){
        if(err) throw err;
        var inStr = buffer.toString('utf8',0,bytesRead);
        console.log('파일에서 읽은 데이터 : %s', inStr);
        console.log(err, bytesRead, buffer);
        fs.close(fd, function(){
            console.log('output.txt파일을 열고 읽기 완료');
        });
    });
});