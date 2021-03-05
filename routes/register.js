const {validate,User} = require('../Models/registerModel')
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt');
const {auth} = require("../middlewares/auth")

router.get('/me',auth,async(req,res)=>{
    //@ts-ignore
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)
})

router.post('/api/users', async (req,res)=>{
    try{
        const {error} = await validate(req.body)
        let user = await User.findOne({email:req.body.email})
        if(user) return res.status(400).send("User already registered")
        user = new User(_.pick(req.body,['name','email','password']))
        const salt = await bcrypt.genSalt(10);
        //@ts-ignore
        user.password = await bcrypt.hash(newUser.password,salt)
        try{
            user.save()
            //@ts-ignore
            const token = user.generateAuthToken()
            res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']))
        }       
        catch(ex){
            res.status(400).send(ex.message)
        }
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})
module.exports = router;