var Schema={};
Schema.createSchema = function(mongoose){
    //스키마 정의
    MemberSchema = mongoose.Schema({
        userId:{ type : String, required: true, unique: true},
        userPwd: { type : String, required: true },
        userName: { type : String, index: 'hashed' },
        age: {type:Number, 'default' : -1},
        // age: {type:Number},
        regDate : { type: Date, index : { unique : false }, 'default': Date.now},
        updateDate : { type: Date, index: { unique : false }, 'default': Date.now}
    });

    //스키마에 static 메소드 추가
    MemberSchema.static('findById', function(userId, callback){
        return this.find({ userId : userId }, callback);
    });
    MemberSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });

    // console.log('MemberSchema 정의함');
    // //MemberModel 모델 정의
    // MemberModel = mongoose.model("members2", MemberSchema); //members2라는 컬렉션이
    // //db에있다면 그것을 그대로 사용하기 위해 짝을 지어주고, 없으면 만들어서 사용해주는 기능
    // console.log('MemberModel 정의함');
    return MemberSchema;
};
module.exports = Schema;