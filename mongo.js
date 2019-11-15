const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const url = process.env.MONGO_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 2) {

  console.log('phonebook: ')

  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {

  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(response => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
  })

} else {

  console.log('something seems to be wrong')
  mongoose.connection.close()

}

