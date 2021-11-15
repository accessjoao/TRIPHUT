const express = require('express');
const tripRouter = express.Router();
const isLogged = require('../Middlewares/LogIn')
const tripController = require('../Controller/tripController')

tripRouter.post('/', isLogged, (req,res)=> {
  res.json({ isLogged: true, user: req.user })
})

tripRouter.get('/alltrips', isLogged,tripController.getAllTrips)

tripRouter.post('/like', isLogged, tripController.updateLikes)

tripRouter.post('/createtrip', isLogged,tripController.createTrip)

tripRouter.get('/:tripId/likes', isLogged, tripController.getLikes)
tripRouter.post('/photos', tripController.updatePhotos)

tripRouter.post('/user/:id/trips', isLogged, tripController.getTripByUser)
tripRouter.post('/trips/:id', tripController.getTrip)

tripRouter.get('/:tripId/delete',isLogged, tripController.deleteTrip)

module.exports = tripRouter;