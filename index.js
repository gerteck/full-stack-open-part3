require('dotenv').config(); // Load environment variables .env file
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Morgan for logging


morgan.token('responseData', function (req, res) {
    return JSON.stringify(req.body);
});
const morganFormatString = morgan(':method :url :status :res[content-length] - :response-time ms , :responseData')

// Attach Middleware
const app = express();
app.use(express.json());
app.use(morganFormatString);

// Set up for MongoDB
// const personName = process.argv[3];
// const personNumber = process.argv[4];

const numOfArgs = process.argv.length;
const url = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

let persons = [
    {
        "id": "1",
        "name": "Arto Hella",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.get('/', (request, response) => {
    response.send('<h1>API for Phonebook</h1>');
});

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>DateTime: ${date}</p>`);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    // Does not delete permanently for now.
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    // person has name and number
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name already exists in phonebook'
        });
    }

    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    response.json(person);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT} \n`)
});