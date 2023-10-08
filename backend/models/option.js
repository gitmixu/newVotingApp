const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
    minlength: 1
  },
})

optionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Option', optionSchema)