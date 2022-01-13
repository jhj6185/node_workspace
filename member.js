var member={ listMember :function(results,res){
    
    if(results.length>0){ //결과 객체 있으면 리스트 전송 
        console.dir(results);
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2> 사용자 리스트 </h2>');
        res.write('<div><ul>');
        
        for(var i = 0; i< results.length; i++){
            var curUserId = results[i]._doc.userId;
           
            var curUserName = results[i]._doc.userName;
           
            res.write('<li>#' + i 
                        +'<br>아이디 : ' + curUserId + ', '
                        +'<br>이름 : ' + curUserName + '</li><br>');
        }
        
        res.write('</ul></div>');
        res.end();
    
    }else{//결과 객체 없으면 실패 응답 전송   
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2> 사용자 리스트 조회 실패</h2>');
        res.end();
    }
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


