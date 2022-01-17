var member={ listMember :function(MemberModel,res,callback){

    MemberModel.findAll(function(err, results){
        if(err){
            console.log('사용자 리스트 조회중 에러 발생 : '+err.stack);
            
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1> 사용자 리스트 조회중 오류 발생 </h1>');
            res.write('<p>' + err.stack + '</p');
            res.end();
            return;
        }
        callback(null,results);
    })
},

// 데이터베이스 모델 객체를 위한 변수 선언
 addMember : function(database, user,userId, userPwd, userName,age, callback){
    console.log('addMember 호출됨 : ' + userId + ', ' + userPwd + ', '+userName+ ',' + age);
    
   
    // save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err,addedUser){
        console.log("addedUser%j",addedUser);
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null,addedUser);
    });
    
},
// 사용자를 인증하는 함수
 authMember: function(database, MemberModel,userId, userPwd, callback){
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd );
                
     // 아이디와 비밀번호를 사용해 검색
     MemberModel.find({"userId":userId, "userPwd":userPwd}, function(err, results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과',userId,userPwd);
        console.dir(results);
        
        if(results.length > 0) {
            console.log('일치하는 사용자 찾음.', userId , userPwd)
            callback(null,results);
        }else{
            console.log('일치하는 사용자 찾지 못함.');
            callback(null,null);
        }
    });
    }
}

module.exports=member;


