exports.printListMember = function(results,res){

    if(results){
        //결과 객체 있으면 리스트 전송 
        console.dir(results);
        res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트</h2>');
        res.write('<div><ul>');
        for(var i=0; i<results.length; i++){
            var curUserId = results[i]._doc.userId;
            var curUserPwd = results[i]._doc.userPwd;
            var curUserName = results[i]._doc.userName;
            var curUserAge = results[i]._doc.age;
            var curRegDate = results[i]._doc.regDate;
            var curUpdateDate = results[i]._doc.updateDate;
            res.write('<li>#'+i+' : '+curUserId+', '+curUserPwd+', '+
            curUserName+', '+curUserAge+', '+curRegDate+', '+curUpdateDate+', '+
            '</li>');
        }
        res.write('</ul></div>');
        res.end();
    }else{
        //결과 객체 없으면 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2> 사용자 리스트 조회 실패</h2>');
        res.end();
    }
    
}

//===================================authMember()===================================


exports.authMember = function(database, MemberModel, userId, userPwd, callback){

    console.log('authMember 호출됨 : '+userId+','+userPwd);
    // 1. 아이디를 사용해 검색
    MemberModel.findById(userId, function(err,results){
        if(err){
            callback(err, null);
            return;
        }
        console.log('아이디 [%s]로 사용자 검색결과',userId);
        if(results.length>0){
            console.log('아이디와 일치하는 사용자 찾음.');
            //callback(null,null);
            // 2. 비밀번호 확인
            if (results[0]._doc.userPwd== userPwd){
                console.log('비밀번호 일치함');
                callback(null,results);
            }
        }else{
            console.log("아이디와 일치하는 사용자를 찾지 못함");
            callback(null,null);
        }
    });
}
//===================================addMember()==========================================
exports.addMember = function(database,MemberModel, userId, userPwd,userName,age, callback){

    console.log('addMember 호출 : '+userId+","+userPwd+","+userName+","+age);
    //MemberModel 인슨턴스 생성
    var user= new MemberModel({"userId": userId, "userPwd": userPwd, "userName": userName, 
    "age": age});
    // save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err, addedUser){
        console.log("addedUser%j",addedUser);
        if(err){
            callback(err,null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null, addedUser);
    });
}
//==========================================================================================

exports.listMember = function(database,MemberModel, callback){
    console.log("listMember 호출됨");
    //모든 회원 검색
    MemberModel.findAll(function(err, results){
        console.log('findall 호출됨');
        if(err){
            callback(err, null);
            return;
        }
        if(results.length>0){
            console.log('등록된 회원 목록 결과'+results);
            callback(null, results);
        }else{
            console.log('등록된 회원 없음');
            callback(null,null);
        }
    });
};// listMember ends
