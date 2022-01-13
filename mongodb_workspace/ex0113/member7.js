//프로토 타입 객체를 할당하는 패턴
function Member(userId, userName){
    this.userId = userId;
    this.userName = userName;
}
Member.prototype.printMember = function(){
    console.log('Member 아이디 : %s, Member 이름 : %s', this.userId, this.userName);
}
module.exports= Member;