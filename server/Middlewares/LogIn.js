const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../Models/UserModel');
const secretKey = 'SHHH this is a secret'

const isLogged = (req,res,next) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json({error: "You must be logged in"})
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, secretKey, (err,payload) => {
    if(err) {
      return res.status(422).json({error:'You must be logged in'})
    }
    const {_id} = payload;
    User.findById(_id)
    .populate('trips', "url_id")
    .exec()
    .then(userdata =>{
      req.user = userdata;
      next();
    })
    .catch(err => console.log(err))
  })

}

module.exports = isLogged;