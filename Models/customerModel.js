const mongoose = require('mongoose');
const Joi = require('joi');

function validateCustomer(customer){
    const schema = {
        name:Joi.string().min(3).required(),
        phone:Joi.string().min(5).max(10).required(),
        isGold:Joi.boolean().required()
    }
    return Joi.validate(customer,schema)
}

const customersSchema = new mongoose.Schema({
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
})
const Customer = mongoose.model('Customers',customersSchema)

exports.customerSchema = customersSchema
exports.validate = validateCustomer
exports.Customer = Customer;