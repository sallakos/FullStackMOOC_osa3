const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv').config()
const Contact = require('./models/contact')

app.use(bodyParser.json())
app.use(morgan('tiny :method :url :status :res[content-length] - :response-time ms :postParam'))
morgan.token('postParam', (req, res) =>
  JSON.stringify(req.body)
)
app.use(cors())
app.use(express.static('build'))

// Kaikki henkilöt. Haetaan tietokannasta.
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts.map(contact => contact.toJSON()))
  })
})

// Henkilöt tallennetaan tietokantaan.
app.post('/api/persons', (req, res, next) => {

  const body = req.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormattedContact => {
      res.json(savedAndFormattedContact)
    })
    .catch(error => next(error))

})

// Yksittäinen henkilö.
app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

  const body = req.body
  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      if (updatedContact) {
        res.json(updatedContact.toJSON())
      } else {
        res.status(400).end()
      }
    })
    .catch(error => next(error))

})

// Info.
app.get('/info', (req, res) => {
  Contact.find({})
    .then(contacts => {
      res.send(`<p>Phonebook has info for ${contacts.length} people</p>
                <p>${new Date}</p>`)
    })
})

const errorHandler = (error, req, res, next) => {

  console.log(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)

}

app.use(errorHandler)

// Palvelininfo.
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})