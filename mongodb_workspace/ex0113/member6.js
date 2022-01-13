//인스턴스 객체를 할당하는 패턴
//모듈 안에서 인스턴스 객체를 만들어 할당

//생성자 함수
function Member(userId, userName){
    this.userId= userId;
    this.userName=userName;
}
Member.prototype.printMember= function(){
    console.log('member 아이디 : %s, member 이름 : %s', this.userId, this.userName);
}
module.exports= new Member('conan', '코난');