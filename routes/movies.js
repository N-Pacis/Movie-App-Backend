const {validate,Movie} = require("../Models/movieModel")
const {Genre} = require("../Models/genresModel")
const express = require('express')
const router = express.Router()
const {auth} = require('../middlewares/auth')
const {admin} = require("../middlewares/admin")

router.get('/', (req, res) => {
    res.send("Welcome To Vidly Movie App")
})
router.get('/api/movies', async (req, res) => {
    const movies = await Movie
        .find()
    res.send(movies)
})
router.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.send(movie)
    } catch (ex) {
        return res.status(404).send("The requested movie was not found")
    }
})

router.post('/api/movies', auth,async (req, res) => {
    try{
        const genre = await Genre.findById(req.body.genreId)
        const newMovie = new Movie({
            title: req.body.title,
            genre:{
                _id:genre._id,
                // @ts-ignore
                name:genre.name
            },
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
        })
        try{
            const {error} = validate(req.body)
            try {
                const createResult = await newMovie.save();
                res.send(createResult);
            } catch (ex) {
                if (error) res.status(400).send(error.details[0].message)
            }
        }
        catch(ex){
            res.status(400).send(ex.message);
        }
    }
    catch(ex){
        res.status(404).send(ex.message)
    }
})
router.put('/api/movies/:id', auth, async (req, res) => {
    const {error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            category: req.body.category
        }, {
            new: true
        });
        res.send(movie)
    } catch (ex) {
        return res.status(404).send("The movie with the given id was not found")
    }
})

router.delete('/api/movies/:id',[auth,admin],async (req, res) => {
    try {
        await Movie.findByIdAndRemove(req.params.id);
        res.send(`Deleted the movie with id:${req.params.id}, successfully!`)
    } catch (ex) {
        return res.status(400).send("The requested movie with the given id was not found")
    }
})
module.exports = router