//스트림 단위로 파일 읽고 쓰기
//createReadStream으로 읽기위해 열고, createWriteStream으로 쓰기위해 열기
var fs = require('fs');
var infile = fs.createReadStream('./output.txt', {flags: 'r'});
var outfile = fs.createWriteStream('./output2.txt',{flags: 'w'}); 
//쓰기에 사용하는 플래그, 파일없으면 생성, 파일있으면 이전내용삭제
infile.on('data',function(data){
    console.log('읽어들인 데이터',data);
    outfile.write(data);
});
infile.on('end', function(){
    console.log('파일 읽기 종료');
    outfile.end(function(){
        console.log('파일 쓰기 종료');
    })
})