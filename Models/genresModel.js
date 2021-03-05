const mongoose = require('mongoose');
const Joi = require('joi');

function validateGenre(genre){
    const schema = {
        name:Joi.string().min(3).required()
    }
    return Joi.validate(genre,schema);
}

const genreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength: 50
    }
})
const Genre = mongoose.model('genres',genreSchema);
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
exports.Genre = Genre;