const User = require('../Models/UserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = 'SHHH this is a secret'

exports.getUser = async (req,res) => {
  try{
    const foundUser = await User.findOne({username:req.params.username}).populate('trips', "url _id description postedDate likes title").exec();
    if(!foundUser) return res.status(422).json({error:'Invalid Username'})
    foundUser.password = undefined;
    res.json({user:foundUser})
  }
catch(err){
  res.status(400).json({error:err})
}
}

exports.updateUser = async (req,res) => {
  const { username, email, fullname } = req.body.data;
  if (!email || !username || !fullname) {
      return res.status(422).json({ error: "PLease enter all fields." })
  }
  User.updateOne({ _id: req.body.id }, { username, email, fullname }).exec()
      .then((result) => {
          if (!result) {
              return res.status(422).json({ error: "Invalid Username" })
          } else {
              User.findById({ _id: req.body.id })
                  .populate("trips", "url _id")
                  .exec()
                  .then(foundUser => {
                      if (foundUser) {
                          foundUser.password = undefined;
                          res.json({ user: foundUser })
                      }
                  })
                  .catch(er => console.log(er))
          }
      })
      .catch(er => console.log(er))

}

exports.updateProfilePhoto = async (req,res) => {
  User.findOne({ username: req.body.username })
  .then((foundUser) => {
      if (!foundUser) {
          return res.status(422).json({ error: "Invalid Username" })
      } else {
          User.updateOne({ username: req.body.username }, { dp: req.body.dp }).exec();
          foundUser.dp = req.body.dp;
          res.json({ user: foundUser })
      }
  })
  .catch(er => console.log(er));
}

exports.registerUser = async (req,res) => {
  const { username, email, password, fullname } = req.body;
    if (!email || !username || !password || !fullname) {
        return res.status(422).json({ error: "PLease enter all fields." })
    }
    User.findOne({ email: email })
        .then((foundUser) => {
            if (foundUser) {
                return res.status(422).json({ error: "User already existed.<br>If it belongs to you then Try Login instead." })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        username,
                        fullname
                    })
                    user.save()
                        .then(user => {
                            res.status(200).json({ message: "Successfully Signed Up.<br>Please Login now.", body:user })
                        })
                        .catch(err => console.log(err));
                })

        })
        .catch(err => console.log(err))
}

exports.signIn = async (req,res) => {
  const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter all fields." })
    }
    User.findOne({ email: email })
        .populate("trips", "url _id description postedDate")
        .exec()
        .then(foundUser => {
            if (!foundUser) {
                return res.status(422).json({ error: "Invalid email or password." })
            }
            bcrypt.compare(password, foundUser.password)
                .then(doMatched => {
                    if (doMatched) {
                        const token = jwt.sign({ _id: foundUser._id }, secretKey);
                        res.json({ token, message: "Successfully signed in.", user: foundUser });
                    } else {
                        return res.status(422).json({ error: "Invalid email or password." })
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.getFollows = async (req, res)=> {
  User.findById(req.params.userId, req.params.task)
        .populate(req.params.task, "username dp _id fullname followers")
        .exec()
        .then(task => {
            if (task) {
                res.json({ [req.params.task]: task });
            } else {
                res.status(422).json({ error: "wrong task" });
            }
        })
        .catch(er => console.log(er))
}

exports.pushFollows = async (req,res) => {
  User.findOne({ username: req.params.username })
  .then((foundUser) => {
      if (!foundUser) {
          return res.status(422).json({ error: "Invalid Username" })
      } else {
          if (foundUser.followers.find(followerId => followerId.equals(req.user._id))) {
              User.updateOne({ username: req.params.username }, { $pull: { followers: req.user._id } }).exec();
              User.updateOne({ username: req.user.username }, { $pull: { following: foundUser._id } }).exec();
          } else {
              User.updateOne({ username: req.params.username }, { $push: { followers: req.user._id } }).exec();
              User.updateOne({ username: req.user.username }, { $push: { following: foundUser._id } }).exec();
          }
      }
  })
  .catch(er => console.log(er));
res.json({ message: "task completed." });
}