module.exports = (app) => {
    const person = require('../controllers/person.controller.js');

    // Create a new Note
    app.post('/person/create', person.create);

    // Retrieve all Notes
    app.get('/person/findAll', person.findAll);

    // Retrieve a single Note with noteId
    app.get('/person/findOne/:personId', person.findOne);

    // Delete a Note with noteId
    app.delete('/person/deleOne/:personId', person.delete);
}