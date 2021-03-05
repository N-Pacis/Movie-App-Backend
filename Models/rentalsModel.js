const Joi = require('joi')
const mongoose = require('mongoose')

const rentalsSchema = new mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            name:{
                type: String,
                minLength:3,
                required:true
            },
            phone:{
                type: String,
                minLength:5,
                maxLength:10,
                required:true
            },
            isGold:{
                type: Boolean,
                required:true
            }
        }),
        required:true
    },
    movie:{
        type:new mongoose.Schema({
            title:{
                type:String,
                required:true,
                trim:true,
                minLength:2,
                maxLength:50,
            },
            dailyRentalRate:{
                type:Number,
                required:true
            }
        }),
        required:true
    },
    dateOut:{
        type:Date,
        default:Date.now()
    },
    dateReturned:{
        type:Date
    },
    rentalFee:{
        type:Number,
        min:0
    }
})

function validateRentals(rentals){
    const schema = {
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required()
    }
    return Joi.validate(rentals,schema)
}
const Rentals = mongoose.model('rental',rentalsSchema)

exports.validate = validateRentals;
exports.rentalsSchema = rentalsSchema;
exports.Rentals = Rentals
