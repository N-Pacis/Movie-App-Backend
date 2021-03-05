const {validate,Customer} = require("../Models/customerModel")
const express = require('express');
const router = express.Router();
const {auth} = require("../middlewares/auth")
const {admin} = require("../middlewares/admin")

router.get('/api/customers', async (req,res,next)=>{
   try{
       const customers = await Customer.find();
       res.send(customers)
   }
   catch(ex){
       next(ex)
   }
})
router.get('/api/customers/:id',async (req,res,next) =>{
   try{
       const customer = await Customer.findById(req.params.id);
       if(!customer) return res.status(404).send("Unable to find the customer with the given id")
       res.send(customer)
   }
   catch (ex){
       next(ex)
   }
})
router.post("/api/customers",auth,async (req,res,next)=>{
    try{
        const newCustomer = new Customer({
            name:req.body.name,
            phone:req.body.phone,
            isGold:req.body.isGold
        })
        try{
            await newCustomer.save()
            res.send(newCustomer)
        }
        catch(ex){
            res.status(400).send(ex.message)
        }
    }
    catch(ex){
        next(ex)
    }
})
router.put('/api/customers/:id',auth,async (req,res,next)=>{
    try{
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message)
        try{
            const customer = await Customer.findByIdAndUpdate(req.params.id,{name:req.body.name,phone:req.body.phone,isGold:req.body.isGold},{new:true})
            res.send(customer)
        }
        catch(ex){
            res.status(400).send(ex.message)
        }
    }
    catch(ex){
        next(ex)
    }
})
router.delete('/api/customers/:id',[auth,admin],async (req,res,next)=>{
    try{
        try{
            await Customer.findByIdAndRemove(req.params.id)
            res.send(`The customer with id:${req.params.id} was deleted successfully!`)
        }
        catch(ex){
            res.status(400).send(ex.message) 
        }
    }
    catch(ex){
        next(ex)
    }
})

module.exports= router;