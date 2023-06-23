const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(morgan('combined'))

const cors = require('cors')

app.use(cors())

morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  })

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(202).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 999999)

    return randomId
}

//trim() checks that it is not a string of spaces
//this route checks that name and number is not m,issing and name doesn't already exist
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || body.name.trim().length === 0) {
        return response.status(400).json({
            error: 'must enter a name'
        })
    } else if (!body.number || body.number.trim().length === 0) {
        return response.status(400).json({
            error: 'must enter a number'
        })
    } else if (persons.find(person => person.name === body.name )) {
        return response.status(400).json({
            error: 'name must be unique'
        })  //a persons name cannot exist twice but a number can
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})


app.get('/info', (request, response) => {
    const info =
        `<p>Phonebook has ${persons.length} people</p><br>
        <p>${Date()} </p>`
    response.send(info)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})