exports.listMember = function(){

    router.route('/process/listMember').post(function(req,res){
        console.log('/process/listMember 호출됨');
        if(database){
            // 1. 모든 사용자 검색
            MemberModel.findAll(function(err,results){
                if(err){
                    console.error('사용자 리스트 조회 중 오류 발생 : '+err.stack);
                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                    res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                    res.write('<p>'+err.stack+'</p>');
                    res.end();
                    return;
                }
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
                    console.log("database on 아니라능");
                }
            }); //findAll end
         }
    })
    
}

//===================================authMember()===================================


exports.authMember = function(){

    router.route('/process/login').post(function(req,res){

        console.log('/process/login 호출됨');
          //요청 파라미터 확인
         var userId = req.body.userId || req.query.userId;
         var userPwd = req.body.userPwd || req.query.userPwd;
         
         //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
         if(database){
             authMember_call(database,userId,userPwd, function(err, docs){
                 if(err){
                     throw err;
                 }
                 //조회된 레코드가 있으면 성공 응답 전송
                 if(docs){
                     res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                     res.write('<h1>로그인 성공</h1>');
                     res.end();
                 } else{
                     //조회된 레코드가 없는 경우 실패 응답 전송
                     res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                     res.write('<h1>로그인 실패</h1>');
                     res.end();
                 }
             });
         }else{
             res.writeHead('200', { 'Content-Type':'text/html;charset=utf8'});
             res.write('<h2>데이터베이스 연결 실패</h2>');
             res.end();
         }
          
      });
    
}

var authMember_call = function(database, userId, userPwd, callback){
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
exports.addMember = function(){

    router.route('/process/addMember').post(function(req,res){
    
        console.log('/process/addMember 호출됨');
          //요청 파라미터 확인
         var userId = req.body.userId || req.query.userId;
         var userPwd = req.body.userPwd || req.query.userPwd;
        var userName= req.body.userName || req.query.userName;
        var age = req.body.age || req.query.age;
    
         console.log('요청 파라미터 : '+userId+','+userPwd+','+userName+','+age);
         //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
         if(database){
             addMember_call(database,userId,userPwd,userName,age, function(err, addedUser){ //result는 
                //addMember에 올라가면 result를 callback(null, result);로 해주고있어서
                // 그 result가 여기의 result인데 어떤 데이터를 insert하게되면,
                //result객체에 몇개의 데이터가 삽입됐는지 뜨고, 어떤 데이터가 삽입되었는지 
                //result에 대한 정보가 쫙 들어있는데 그거가 있고, insertedCount가 0보다 큰지
                //이런거로 확인해주는 것...(근데 playground result에는 result의 아이디값만 뜸..)
                 if(err){
                     throw err;
                 }
                 //추가된 데이터가 있으면 성공 응답 전송
                 if(addedUser){
                     console.dir(addedUser);
                     res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                     res.write('<h1>회원가입 성공</h1>');
                     res.end();
                 } else{
                     //결과 객체가 없으면 실패 응답 전송
                     res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
                     res.write('<h1>회원가입 실패</h1>');
                     res.end();
                 }
             });
         }else{ //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
             res.writeHead('200', { 'Content-Type':'text/html;charset=utf8'});
             res.write('<h2>데이터베이스 연결 실패</h2>');
             res.end();
         }
          
      });
    
}

var addMember_call = function(database, userId, userPwd,userName,age, callback){
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

app.use('/', router) //라우터 객체를 app객체에 등록

app.all('*', function(req, res){//등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
})

app.listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : '+app.get('port'));
    //데이터베이스 연결을 위한 함수 호출
    connectDB();
});