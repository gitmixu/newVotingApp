const mongoose = require('mongoose')

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  options: Array,
})

pollSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Poll', pollSchema)