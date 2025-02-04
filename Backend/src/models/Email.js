const User = require("./User")

const Mongoose = require("mongoose")
const EmailSchema = new Mongoose.Schema({
  from:{ 
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
 },  
  to: 
  { 
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
 },
  date: {
    type: Date,
    default: Date.now,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String, 
    enum: ['sent', 'draft'], 
    default: 'draft'
    },
})

const Email = Mongoose.model("email", EmailSchema)
module.exports = Email