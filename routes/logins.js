const {User} = require('../Models/registerModel')
const express = require('express');
const router = express.Router();
const Joi =  require('joi')
const bcrypt = require('bcrypt');

router.post('/api/login', async (req,res)=>{
    try{
        const {error} = await validate(req.body)
        const user = await User.findOne({email:req.body.email})
        if(!user) return res.status(400).send("Invalid email or password")
        //@ts-ignore
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.status(400).send("Invalid email or password")
        //@ts-ignore
        const token = user.generateAuthToken()
        res.send(token);
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})
function validate(user){
    const schema = {
        email:Joi.string().min(5).max(50).required().email(),
        password:Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user,schema)
}
module.exports = router;
