//새 디렉터리 만들고 삭제하기
// mkdir 로 만들고 rmdir로 삭제
var fs = require('fs');
fs.mkdir('./docs', 0666, function(err){
    if(err) throw err;
    console.log('새로운 docs폴더를 생성');
});
fs.rmdir('./docs', function(err){
    if(err) throw err;
    console.log('새로운 docs폴더를 삭제');
});