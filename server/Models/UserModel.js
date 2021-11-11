const mongoose = require('../db');
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
username: {
    type: String,
    requied: true
},
email: {
    type: String,
    requied: true
},
password: {
    type: String,
    requied: true
},
fullname: {
  type: String,
  required: true
},
dp: {
  type: String,
},
followers: [{
  type: ObjectId,
  ref: "User"
}],
following: [{
  type: ObjectId,
  ref: "User"
}],
trips: [{
  type: ObjectId,
  ref: "Trip"
}]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

