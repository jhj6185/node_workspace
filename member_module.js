//=======PROClogin======================================
var procLogin = function (req, res) {

    console.log('모듈내에 있는 procLogin 호출됨');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var database = req.app.get('database');

    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database.db) {
        authMember(database, userId, userPwd, function (err, docs) {
            if (err) {
                throw err;
            }
            //조회된 레코드가 있으면 성공 응답 전송
            if (docs) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' }); //writeHead = 사용자응답
                //이건 하나만 있어야함! 또 불러오면 오류남
                var context = { userId: userId, userPwd: userPwd };
                req.app.render('loginSuccess', context, function (err, html) {//어떻게 loginSuccess불러옴?
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                })// render end
            } else {
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }

}
//============procAddMember==================================
var procAddMember = function (req, res) {

    console.log('/process/addMember 호출됨');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    // var userName = req.body.userName || req.query.userName;
    // var age = req.body.age || req.query.age;
    var database = req.app.get('database');

    console.log('요청 파라미터 : ' + userId + ',' + userPwd );
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database.db) {
       
        addMember(database, userId, userPwd, function (err, addedUser) { //result는 
            //addMember에 올라가면 result를 callback(null, result);로 해주고있어서
            // 그 result가 여기의 result인데 어떤 데이터를 insert하게되면,
            //result객체에 몇개의 데이터가 삽입됐는지 뜨고, 어떤 데이터가 삽입되었는지 
            //result에 대한 정보가 쫙 들어있는데 그거가 있고, insertedCount가 0보다 큰지
            //이런거로 확인해주는 것...(근데 playground result에는 result의 아이디값만 뜸..)
            var context = { userId: userId, userPwd: userPwd };
                req.app.render('addSuccess', context, function (err, html) {
            if (err) {
                throw err;
            }
            //추가된 데이터가 있으면 성공 응답 전송
            if (addedUser) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' }); //writeHead = 사용자응답
                //이건 하나만 있어야함! 또 불러오면 오류남
                
                console.dir(addedUser);
                // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                // res.write('<h1>회원가입 성공</h1>');
                res.end(html);// res.end(html)이 없으면 html을 담아서 rendering이 안되서
                //페이지 이동이 안됨! 명심
            
            } else {
                //결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원가입 실패</h1>');
                res.end();
            }
        });//render end
        });
    } else { //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }

}
//==========procListMember=====================================
var procListMember = function (req, res) {
    console.log('/process/listMember 호출됨');
    var database = req.app.get('database');
    if (database) {
        // 1. 모든 사용자 검색
        listMember(database, function (err, results) {
            if (err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (results) {
                var context = { results: results };
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' }); //writeHead = 사용자응답
                // //member.js에서 results가 정의되어있지않다고 뜸
                req.app.render('listMember', context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                        // //결과 객체 있으면 리스트 전송 
                        // console.dir(results);
                    }
                    res.end(html);
                })
            } else {
                //결과 객체 없으면 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2> 사용자 리스트 조회 실패</h2>');
                res.end();
            }
        }); //findAll end
    }//if
}

//======================procUpdate==================================
var procUpdateMember = function (req, res) {

    console.log('/process/updateMember 호출됨');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;

    var database = req.app.get('database');

    console.log('요청 파라미터 : ' + userId + ',' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        updateMember(database, userId, userPwd, userName, age, function (err, result) {
            if (err) {
                throw err;
            }
            //조회된 레코드가 있으면 성공 응답 전송
            if (result) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원정보 수정 성공</h1>');
                res.end();
            } else {
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원정보 수정 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }

}

//--------------------------------db처리해주는 함수선언-------------------------------
//============사용자를 인증하는 함수===============================
var authMember = function (database, userId, userPwd, callback) {

    console.log('authMember 호출됨 : ' + userId + ',' + userPwd);
    // 1. 아이디를 사용해 검색
    database.MemberModel.findById(userId, function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('아이디 [%s]로 사용자 검색결과', userId);
        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');
            //callback(null,null);
            // 2. 비밀번호 확인
            if (results[0]._doc.userPwd == userPwd) {
                console.log('비밀번호 일치함');
                callback(null, results);
            }
        } else {
            console.log("아이디와 일치하는 사용자를 찾지 못함");
            callback(null, null);
        }
    });
}

//========================사용자를 추가하는 함수====================
var addMember = function (database, userId, userPwd, callback) {

    console.log('addMember 호출 : ' + userId + "," + userPwd );
    //MemberModel 인슨턴스 생성
    var user = new database.MemberModel({
        "userId": userId, "userPwd": userPwd
    });
    // save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function (err, addedUser) {
        console.log("addedUser%j", addedUser);
        if (err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null, addedUser);
    });
}
//===========================listMember=============================
var listMember = function (database, callback) {
    console.log("listMember 호출됨");
    //모든 회원 검색
    database.MemberModel.findAll(function (err, results) {
        console.log('findall 호출됨');
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length > 0) {
            console.log('등록된 회원 목록 결과' + results);
            callback(null, results);
        } else {
            console.log('등록된 회원 없음');
            callback(null, null);
        }
    });
};// listMember ends

//=================================회원정보 수정기능=============================
//memberModel방식으로 변경하기
var updateMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('updateMember 호출 : ' + userId + "," + userPwd);

    database.MemberModel.updateMany({ "userId": userId }, {
        $set: {
            "userPwd": userPwd,
            "userName": userName, "age": age
        }
    }, function (err, result) {
        if (err) {
            //오류 발생시 콜백함수가 호출되어 오류객체 전달
            callback(err, null);
            return;
        }
        if (result.modifiedCount > 0) {
            console.log("사용자 레코드 수정됨 : " + result.modifiedCount);
        } else {
            console.log("추가되지 않았음");
        }
        callback(null, result);
    });
}


module.exports.procLogin = procLogin;
module.exports.procAddMember = procAddMember;
module.exports.procListMember = procListMember;
module.exports.procUpdateMember = procUpdateMember;
