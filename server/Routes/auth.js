const express = require('express');
const authRouter = express.Router();
const isLogged = require('../Middlewares/LogIn')
const userController = require('../Controller/authController');



// This route returns userdata of the provided userId
authRouter.post('/user/:username', isLogged, userController.getUser)
// This authRouter update user profile information with the information recieved
authRouter.post('/updateUser', isLogged,userController.updateUser)
//  This route update the profile photo and returns updated user info
authRouter.put('/updateProfilePhoto', isLogged,userController.updateProfilePhoto)
// this route will follow/unfollow particular user to/from loggeduser lists
authRouter.post('/user/:username/follow', isLogged, userController.pushFollows)
//  This route will register new user
authRouter.post('/signup',userController.registerUser)
// This route will return user data if recieved data matches with the one we have in our DB
authRouter.post('/signin',userController.signIn)
// This route recieves task params to know what task to perform
//  following or followers = task options 
authRouter.get('/followersOrFollowings/:userId/:task', isLogged,userController.getFollows)

module.exports = authRouter;