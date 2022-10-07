let express = require('express');
let morgan = require('morgan');
let cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('build'))

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
];


morgan.token('persons', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persons'))

app.get('/info', (request, response) => {
  response.send(`<h1>Phonebook has info for ${persons.length} people </h1>
  <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(item => {
    return item.id === id
  })

  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(item => item.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const filteredName = persons.find(item => item.name === body.name);

  if(!(body.name && body.number) || filteredName) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.random() * persons.length
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})