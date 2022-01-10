//엣지 검사-콘솔창에서 하면 안나오고 크롬에선 나옴.. 참고
function person(){};
console.log(person.prototype);

person.prototype.name='conan';
console.log(person.prototype);