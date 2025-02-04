const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },  
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})

const User = Mongoose.model("user", UserSchema)
module.exports = User