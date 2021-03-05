const error = require("./middlewares/error")
const express = require("express")
const config = require("config")
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const app = express()

if(!config.get('jwtPrivateKey')){
   console.error("FATAL ERROR: jwtPrivateKey is not defined!")
   process.exit(1)
}
app.use(express.json())
app.use(require('./routes/movies'))
app.use(require('./routes/customers'))
app.use(require('./routes/genres'))
app.use(require('./routes/rentals'))
app.use(require('./routes/register'))
app.use(require('./routes/logins.js'))

app.use(error)

mongoose.connect("mongodb://localhost/Movie_App",{useUnifiedTopology:true,useNewUrlParser:true})
   .then(()=>console.log("Connected to mongoDb successfully..."))
   .catch(err=>console.log("Could not connect to mongoDb....",err))

const port = process.env.PORT || 3000
app.listen(port,() =>{console.log(`Listening to port ${port}`)})