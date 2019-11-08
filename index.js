const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny :method :url :status :res[content-length] - :response-time ms :postParam'))
morgan.token('postParam', (req, res) => 
	JSON.stringify(req.body)
)
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

// Kaikki henkilöt.
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {

  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name is missing.'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'Number is missing.'
    })
  }

  const personNames = persons.map(person => person.name.trim().toLowerCase())

  if (personNames.indexOf(body.name.trim().toLowerCase()) >= 0) {
    return res.status(400).json({
      error: 'Name must be unique.'
    })
  }

  const person = {
    name: body.name,
    number : body.number,
    id: Math.floor(Math.random() * (1000 - 5 + 1) + 5)
  }

  persons = persons.concat(person)

  res.json(person)

})

// Yksittäinen henkilö.
app.get('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

// Info.
app.get('/info', (req, res) => {
  const numberOfContacts = persons.length
  res.send(`<p>Phonebook has info for ${numberOfContacts} people</p>
  <p>${new Date}</p>`)
})

// Henkilön tietojen muuttamista ei toteutettu!

// Palvelininfo.
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})