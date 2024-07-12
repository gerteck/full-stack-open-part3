require('dotenv').config(); // Load environment variables .env file
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
console.log('connecting to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// Transform the returned object to a compatible format
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema); // Export the model
