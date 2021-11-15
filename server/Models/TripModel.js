const mongoose = require('../db');
const { ObjectId } = mongoose.Schema.Types;

const TripSchema = new mongoose.Schema({

title:{
  type:String
},
  description: {
    type: String,
    required: true
},
url: {
  type: String,
  required: true
},
photos:[{
  type:String,
}],
postedBy: {
  type: ObjectId,
  ref: "User"
},
likes: [{
  type: ObjectId,
  ref: 'User'
}],
travelDate:{
  type: Date,
  default: Date.now
},
postedDate: {
  type: Date,
  default: Date.now
}
})


const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;