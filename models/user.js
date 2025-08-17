const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        default:"admin"
    }


})
const UserModel = mongoose.model('user',UserSchema)
module.exports =UserModel
