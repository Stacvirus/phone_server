const express = require('express')
const app = express()

// allowing request from all origins
const cors = require("cors")
app.use(cors())
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

// app.get("/", (request, response) =>{
//     response.send("<h1>Hello World</h1>")
// })

// handling logger path
var morgan = require("morgan")
app.use(morgan("combine"))

app.post("/", (req, res) => {
    res.send("endpoint does not exist")
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

//implementing infos page
let infos = {
    numPerson: persons.length,
    now: new Date()
}

// accessing all data
app.get("/api/infos", (request, response) => {
    response.send(`<p>PhoneBook has infos for ${infos.numPerson} people</p> <p>${infos.now}</p>`)
})

// accessing a specified data
app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id,
        person = persons.find(note => note.id == id)
    if (person) response.json(person)
    else response.status(404).end()
})

// deleting a specified data
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

morgan.token("stac", (req, res) =>{
    console.log(JSON.stringify(res.body))
    return req.body
})
// emplementing post request
function generateId() {
    const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
    return maxId + 1
}
app.use(express.json())
app.use(morgan("stac"))
app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(204).json({ erro: "content is missing" })
    }
    if (persons.map(per => per.name).includes(body.name)) {
        return response.status(204).json({ erro: "person name already exist" })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
    
})

// printing the posted data to the console using morgan


// app.post("/api/persons", (req, res) =>{
//     res.send("fuck is good")
// })


const PORT = process.env.PORT || 3005
app.listen(PORT, () =>{
    console.log("server running on port " + PORT)
})
