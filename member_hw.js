exports.listMember = function(database, MemberModel, res){
    console.log('/process/listMember 호출 됨')
    if(database){
        //1. 모든 사용자 검색
        MemberModel.findAll(function(err, results){
            if(err){
                console.error('사용자 리스트 조회 중 오류 발생: ' + err.stack)
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>')
                res.write('<p>'+ err.stack +'</p>')
                res.end()
                return
            }
            if(results){ //결과 객체 있으면 리스트 전송
                console.dir(results)
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h2>사용자 리스트</h2>')
                res.write('<div><ul>')
                for(var i=0; i<results.length; i++){
                    var curUserId = results[i]._doc.userId
                    var curUserName = results[i]._doc.userName
                    var curUserage = results[i]._doc.age
                    var curUserregDate = results[i]._doc.regDate
                    var curUserupdateDate = results[i]._doc.updateDate
                    res.write('<li>#'+i+' : '+curUserId+', '+curUserName+ ', '+curUserage+ ', '+curUserregDate+ ', '+curUserupdateDate+'</li>')
                }
                res.write('</ul></div>')
                res.end()
            }
            else{ //결과 객체가 없으면 실패 응답 전송

            }
        })  //findAll
    }
}

exports.authMember = function(database, req, res, authMember){
    console.log('/process/authMember')
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId
    var userPwd = req.body.userPwd || req.query.userPwd
    console.log('요청 파라미터 : '+ userId + ',' + userPwd)
    //데이터베이스 객체가 최기화된 경우, authMember 함수 호출하여 사용자 인증
    if(database){
        authMember(database, userId, userPwd, function (err, results) {
            if(err) {throw err}
            //조회된 레코드가 있으면 성공 응답 전송
            if(results && results.length > 0){
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h1>사용자 인증 성공</h1>')
                res.end()
            }
            else{
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h1>사용자 인증 실패</h1>')
                res.end()
            }
        })
    }
    else{
        res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
        res.write('<h1>데이터베이스 연결 실패</h1>')
        res.end()
    }
}

exports.addMember = function(database, req, res, addMember){
    console.log('/process/addMember 호출됨')
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId
    var userPwd = req.body.userPwd || req.query.userPwd
    var userName = req.body.userName || req.query.userName
    var userAge = req.body.userAge || req.query.userAge
    console.log('요청 파라미터 : '+ userId + ',' + userPwd + ',' + userName+ ',' + userAge)
    //데이터베이스 객체가 최기화된 경우, addMember 함수 호출하여 사용자 인증
    if(database){
        addMember(database, userId, userPwd, userName, userAge, function (err, addedUser) {
            if(err) {throw err}
            //추가된 데이터가 있으면 성공 응답 전송
            if(addedUser){
                console.dir(addedUser)
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h1>가입 성공</h1>')
                res.end()
            }
            else{   //결과 객체가 없으면 실패 응답 전송
                res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
                res.write('<h1>가입 실패</h1>')
                res.end()
            }
        })
    }
    else{
        res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'})
        res.write('<h1>데이터베이스 연결 실패</h1>')
        res.end()
    }
}

