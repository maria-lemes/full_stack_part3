require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

morgan.token('post-person',function(req){
  if (req.method === 'POST') return JSON.stringify(req.body)
})


//Middleware loading

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :post-person'))
app.use(errorHandler)



app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  let currentDate = new Date()
  Person.count({}).then(total =>
    response.send(`<p>Phonebook has info for ${total} people</p>
  <p>${currentDate}</p>`)
  )

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//IMPORTANT: update of numbers was done in the post method as I didn't implement the put during part 2
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name ) {
    return response.status(400).json({
      error: 'name missing'
    })
  }else if(!body.number ){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  //If we want to use the post method only to add and not update:
  // const person = new Person({
  //   name: body.name,
  //   number: body.number,
  // })
  //person.save().then(savedPerson => {response.json(savedPerson)})


  //Solution to add and update in case a matching name is found:
  Person.findOneAndUpdate({ 'name': body.name }, { 'number':body.number }, { upsert: true, new: true })
    .then(
      foundPerson => response.json(foundPerson)
    )

})



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})