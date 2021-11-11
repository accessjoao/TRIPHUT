const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TripHut',{
  useNewURLParser: true,
})
.then(()=>{
  console.log('Successfully connected to DB')
})
.catch((e)=>{
  console.log(e);
})

module.exports = mongoose;