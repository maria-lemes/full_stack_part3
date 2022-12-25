const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

morgan.token("post-person",function(req,res){
  if (req.method === "POST") return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :post-person'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  let currentDate = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${currentDate}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
  })

  
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
    }else if(persons.find(person => person.name === body.name)){
      return response.status(400).json({ 
        error: 'This name already existis on the phonebook' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 100000)
    }
  
   
    persons = persons.concat(person)
  
    response.json(person)
  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })