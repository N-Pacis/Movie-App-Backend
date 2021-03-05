const {validate,Genre} = require('../Models/genresModel')
const {auth} = require("../middlewares/auth")
const {admin} = require("../middlewares/admin")
const express = require('express')
const router = express.Router()

router.get('/api/genres',async (req,res)=>{
    try{
        const genres = await Genre.find()
        res.send(genres)
    }
    catch(err){
        res.status(500).send("Something failed")
    }
})
router.get('/api/genres/:id',async (req,res)=>{
    try{
        const genre = await Genre.findById(req.params.id)
        res.send(genre)
    }
    catch(err){
        res.status(400).send(err.message);
    }
})
router.post('/api/genres',auth,async (req,res)=>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const newGenre = new Genre({
        name:req.body.name
    })
    try{
        const genre = await newGenre.save()
        res.send(genre)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
router.put('/api/genres/:id',auth,async (req,res)=>{
    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true})
        res.send(genre)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
router.delete('/api/genres/:id',[auth,admin],async(req,res)=>{
    try{
        const genre = await Genre.findByIdAndDelete(req.params.id)
        res.send(genre)
    }
    catch(err){
        res.status(400).send(err.message);
    }
})
module.exports = router;