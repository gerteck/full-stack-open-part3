const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];
const databaseName = "phonebookApp";
const numOfArgs = process.argv.length;
const url =
    `mongodb+srv://fullstack:${password}@full-stack-open-part3.tgf7jew.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=full-stack-open-part3`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// show all persons if only password supplied
if (numOfArgs == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        });
        mongoose.connection.close();
    });
} else if (numOfArgs == 5) {
    const person = new Person({
        name: personName,
        number: personNumber,
    });
    person.save().then(result => {
        console.log('person saved!');
        mongoose.connection.close();
    });
} else {
    console.log('Invalid number of arguments');
    mongoose.connection.close();
}

