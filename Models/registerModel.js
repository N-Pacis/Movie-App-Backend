const config = require('config')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

function validateUser(user){
    const schema = {
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().min(5).max(50).required().email(),
        password:Joi.string().min(5).max(35).required()
    }
    return Joi.validate(user,schema)
}

const registerSchema = new mongoose.Schema({
   name:{
       type:String,
       minLength:3,
       maxLength:30,
       required:true
   },
   email:{
       type:String,
       unique:true,
       required:true,
       maxLength:50,
       minLength:5
   },
   password:{
       type:String,
       minLength:5,
       maxLength:350,
       required:true
   },
   isAdmin:{
       type:Boolean,
       required:true
   }
})
registerSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,name:this.name,isAdmin:this.isAdmin},config.get('jwtPrivateKey'))
    return token
}
const User = mongoose.model('user',registerSchema)

exports.User = User
exports.validate = validateUser