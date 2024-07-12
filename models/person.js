require('dotenv').config(); // Load environment variables .env file
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
console.log('connecting to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url).then(_result => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        minlength: 3,
    },
    number: {
        type: String,
        required: [true, 'Phone number required'],
        minlength: 8,
        validate: {
            // Custom validator, but 4-4 format instead for Singapore
            validator: (v) => {
                return /\d{4}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Use XXXX-XXXX format instead.`
        }
    },
});

// Transform the returned object to a compatible format
personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema); // Export the model
