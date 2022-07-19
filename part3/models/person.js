const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type:String,
    minLength: 3,
    required: true
  },
  number: { type:String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        const arr = v.split('-')

        for(var x in arr) {
          if (!(/^\d+$/.test(x))) {
            return false
          }
        }

        if (arr.length === 1) {
          if (arr[0].length >= 8) {
            return true
          } else {
            return false
          }
        }

        return arr.length <= 2 && ((arr[0].length === 2 && arr[1].length >= 5)
          || (arr[0].length === 3 && arr[1].length >= 4))
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', personSchema)