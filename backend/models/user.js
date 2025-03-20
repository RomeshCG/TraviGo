const mongoose = require('mongoose');

const userSChema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    phoneNumber:{type:String, required:true},
    country:{type:String, required:true},
    createdAt:{type:Date,default:Date.now},
});

module.exports = mongoose.model('User', userSChema)