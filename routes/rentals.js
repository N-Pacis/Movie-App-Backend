const express = require('express')
const {validate,Rentals} = require('../Models/rentalsModel')
const {Customer} = require('../Models/customerModel')
const {Movie} = require('../Models/movieModel')
const router = express.Router()
const {auth} = require("../middlewares/auth")
const {admin} = require("../middlewares/admin")

router.get('/api/rentals',async (req,res)=>{
    try{
        const rentals = await Rentals.find();
        res.send(rentals)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})
router.get('/api/rentals/:id',async (req,res)=>{
    try{
        const rental = await Rentals.findById(req.params.id);
        res.send(rental)
    }
    catch(ex){
        res.status(404).send(ex.message)
    }
})
router.post('/api/rentals',auth,async (req,res)=>{
    try{
        const customer = await Customer.findById(req.body.customerId)
        try{
            const movie = await Movie.findById(req.body.movieId)
            const {error} = validate(req.body)
            try{
                // @ts-ignore
                if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock");
                const newRental = new Rentals({
                    customer:{
                        _id:customer._id,
                        // @ts-ignore
                        name:customer.name,
                        // @ts-ignore
                        phone:customer.phone,
                        // @ts-ignore
                        isGold : customer.isGold   
                    },
                    movie:{
                        _id:movie._id,
                        // @ts-ignore
                        title:movie.title,
                        // @ts-ignore
                        dailyRentalRate:movie.dailyRentalRate
                    },
                    dateOut:req.body.dateOut,
                    dateReturned: req.body.dateReturned,
                    rentalFee : req.body.rentalFee
                })
                try{
                    const rental = await newRental.save()
                    res.send(rental)
                    // @ts-ignore
                    movie.numberInStock--;
                    try{
                        await movie.save()
                    }
                    catch(ex){
                        res.status(400).send(ex.message)
                    }
                }
                catch(ex){
                    res.status(400).send(ex.message)
                }
            }
            catch{
                res.status(400).send(error.details[0].message)
            }
        }
        catch(ex){
            res.status(404).send(ex.message)
        }
    }
    catch(ex){
        res.status(404).send(ex.message)
    }
})
router.delete('/api/rentals/:id',[auth,admin],async (req,res)=>{
    try{
        const rental = await Rentals.findByIdAndDelete(req.params.id)
        res.send(rental)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

module.exports = router