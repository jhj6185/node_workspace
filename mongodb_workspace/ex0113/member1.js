//exports 전역변수 사용

//exports 객체 속성으로 함수 추가
exports.getMember = function(){
    return { userId : 'conan', userName: '코난'};
}

//exports 객체 속성으로 객체 추가
exports.group={userId : 'group01', userName: '어린이 탐정단'};