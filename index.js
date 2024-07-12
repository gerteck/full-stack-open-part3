const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Morgan for logging

morgan.token('responseData', function (req, res) {
    return JSON.stringify(req.body);
});
const morganFormatString = morgan(':method :url :status :res[content-length] - :response-time ms , :responseData')

// Attach Middleware
const app = express();
app.use(cors());
app.use(express.static('dist')); // Frontend Library
app.use(express.json());
app.use(morganFormatString);

// MongoDB Connection, Person Model
const Person = require('./models/person');

// Overwritten by the frontend
// app.get('/', (request, response) => {
//     response.send('<h1>API for Phonebook</h1>');
// });

app.get('/info', (request, response) => {
    const date = new Date();
    const uptime = process.uptime(); // Server uptime in seconds

    // Convert uptime to a more readable format
    const uptimeDays = Math.floor(uptime / (24 * 60 * 60));
    const uptimeHours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);

    response.send(`
        <h1>Phonebook Info</h1>
        <p>Server has been running for: ${uptimeDays} days, ${uptimeHours} hours, ${uptimeMinutes} minutes, ${uptimeSeconds} seconds</p>
        <p>Current server time: ${date.toLocaleString()}</p>
        <h2>Available Endpoints</h2>
        <ul>
            <li>GET / - FrontEnd Page</li>
            <li>GET /info - Information about the phonebook and server</li>
            <li>GET /api/persons - Retrieve all persons</li>
            <li>GET /api/persons/:id - Retrieve a person by ID</li>
            <li>POST /api/persons - Add a new person</li>
            <li>DELETE /api/persons/:id - Delete a person by ID</li>
        </ul>
    `);
});

app.get('/api/persons', (request, response) => {
    // Connect to persons database in MongoDB
    Person.find({}).then(persons => {
        response.json(persons);
    });
    return;
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end();
    });
    return;
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body) {
        return response.status(400).json({
            error: 'request body missing'
        });
    }

    // person has name and number
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    // Does not check for duplicate names yet

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const castErrorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

app.use(unknownEndpoint);

// Error Handler comes at the very end.
app.use(castErrorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('visit BaseUrl/info to start');
    console.log('e.g. if running locally, visit http://localhost:3001');
    console.log('For Info, visit http://localhost:3001/info');
});