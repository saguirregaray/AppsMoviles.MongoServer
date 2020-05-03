const Person = require('../models/person.model.js');

// Create and Save a new person
exports.create = (req, res) => {
    // Create a person
    const person = new Person({
        nombre: req.body.nombre, 
        apellido: req.body.apellido,
        telefono: req.body.telefono
    });

    // Save person in  database
    person.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the person."
        });
    });
};

// Retrieve and return all peopple from the database.
exports.findAll = (req, res) => {
    Person.find()
    .then(person => {
        res.send(person);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

};

// Find a single person with a personId
exports.findOne = (req, res) => {

    Person.findById(req.params.personId)
    .then(person => {
        if(!person) {
            return res.status(404).send({
                message: "Person not found with id " + req.params.personId
            });            
        }
        res.send(person);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Person not found with id " + req.params.personId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving person with id " + req.params.personId
        });
    });

};

// Delete a person with the specified personId in the request
exports.delete = (req, res) => {

    Person.findByIdAndRemove(req.params.personId)
    .then(person => {
        if(!person) {
            return res.status(404).send({
                message: "Person not found with id " + req.params.personId
            });
        }
        res.send({message: "Person deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Person not found with id " + req.params.personId
            });                
        }
        return res.status(500).send({
            message: "Could not delete person with id " + req.params.personId
        });
    });

};