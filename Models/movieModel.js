const Joi = require("joi");
const mongoose = require('mongoose');
const { genreSchema } = require("./genresModel")

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        genreId:Joi.objectId().required(),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    return Joi.validate(movie,schema)
}
const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:50,
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:50
    },
    dailyRentalRate:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
const Movie = mongoose.model('Movies_list', movieSchema);

exports.validate = validateMovie
exports.movieSchema = movieSchema
exports.Movie = Movie