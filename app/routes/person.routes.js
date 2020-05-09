module.exports = (app) => {
    const person = require('../controllers/person.controller.js');

    // Create a new person
    app.post('/person/create', person.create);

    //update person
    app.put('/person/update/:personId', person.put);

    // Retrieve all people
    app.get('/person/findAll', person.findAll);

    // Retrieve a single person with id
    app.get('/person/findOne/:personId', person.findOne);

    // Delete a person with id
    app.delete('/person/deleOne/:personId', person.delete);
}