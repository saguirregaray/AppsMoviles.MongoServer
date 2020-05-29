const Item = require('../models/item.model.js');
const cassandra = require('cassandra-driver');
var assert = require('assert');


//cassandre client
const client = new cassandra.Client(
    { contactPoints: ['localhost'], keyspace: 'images', localDataCenter: 'datacenter1' });
client.connect(function (err) {
    assert.ifError(err);
})


var path = require('path');
var fs = require('fs');
var base64 = fs.readFileSync('/Users/macbook/Library/Mobile Documents/com~apple~CloudDocs/Facultad/Tercero/Aplicaciones Moviles/Pocket Wear Server/app/testImages/3061172.jpg', 'base64');

var imageBuffer = new Buffer(base64, 'base64');


//OBS: create just adds the image signaled before 

// Create and Save item
exports.create = (req, res) => {
    // Create item
    const item = new Item({
        type: req.body.type,
        color: req.body.color,
        season: req.body.season
    });

    // Save item in  database
    item.save()
        .then(data => {

            const query = 'INSERT INTO image_store (key, image) VALUES (?, ?)';
            client.execute(query, [data.id, imageBuffer], { prepare: true }, function (err, result) {
                assert.ifError(err);
                res.send(data);
            });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the item."
            });
        });
};

// Retrieve and return all items from the database.
exports.findAll = (req, res) => {
    Item.find()
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all items from the database.
exports.findAllImages = (req, res) => {
    const query = 'SELECT image FROM image_store';
    client.execute(query,[] , { prepare: true }, function (err, images) {
        assert.ifError(err); 
        res.send(images);
    })
};


// Update items
exports.put = (req, res) => {
    // Find item and update it with the request body
    Item.findByIdAndUpdate(req.params.itemID, {
        type: req.body.type,
        color: req.body.color,
        season: req.body.season
    }, { new: true })  //returns modified doc 
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            res.send(item);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error updating item with id " + req.params.itemID
            });
        });
};

// Find a single item's image with a itemID
exports.findOneImage = (req, res) => {

    Item.findById(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            const query = 'SELECT image FROM image_store WHERE key = ?';
            // Set the prepare flag in your queryOptions
            client.execute(query, [String(item._id)], { prepare: true }, function (err, image) {
                assert.ifError(err);
                res.send(image);
            });


        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error retrieving item with id " + req.params.itemID
            });
        });
};

// Find a single item with a itemID
exports.findOne = (req, res) => {

    Item.findById(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            res.send(item);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error retrieving item with id " + req.params.itemID
            });
        });
};

// Delete item with the specified itemID in the request
exports.delete = (req, res) => {

    Item.findByIdAndRemove(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            res.send({ message: "Item deleted successfully" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Could not delete item with id " + req.params.itemID
            });
        });

};

// Retrieve and return all items from the database.
exports.findWithCondition = (req, res) => {
    Item.find({
        $or: [
            { type: req.body.type },
            { color: req.body.color },
            { season: req.body.season }

        ]
    })
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });

};

