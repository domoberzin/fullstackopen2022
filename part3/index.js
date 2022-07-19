const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.js')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ')
  }
}))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


app.get('/api/persons', (request, response) => {
  Person.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/info', (request, response) => {

  Person.find({}).then(
    people => {
      response.send(`<p>Phonebook has info for ${people.length} people</p>
        <p>${new Date()}</p>`)
    }
  )

})


app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
// const person = persons.find(note => note.id === id)



app.delete('/api/persons/:id', (request, response, next) => {
  Person.findOneAndDelete({ id: request.param.id })
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
    // persons = persons.filter(note => note.id !== id)
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  var people = Person.find({}).then(res => res.filter(x => x.name === body.name))

  if (people.length === 1) {
    return response.status(400).json({
      error: 'already added'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => {
    next(error)})
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findOneAndUpdate(request.param.id, { number: body.number }, { new: true, runValidators: true, context: 'query' } )
    .then(res => {
      response.json(res)
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'Invalid change' })
      } else {
        next(error)
      }
    })
}
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)