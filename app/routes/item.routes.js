module.exports = (app) => {
    const item = require('../controllers/item.controller.js');

    // Create new item
    app.post('/item/create', item.create);                      //Falta ver como recibir la imagen por body

     // Delete an item data with id
    app.delete('/item/deleteOne/:itemID', item.delete);

    //DATA

    //update item data
    app.put('/item/update/:itemID', item.put);

    // Retrieve all items data
    app.get('/item/findAll', item.findAll);                         //Done

    // Retrieve a single item data with id
    app.get('/item/findOne/:itemID', item.findOne);                 //Done

    // Retrieve items data by filter
    app.get('/item/findWithCondition', item.findWithCondition);    

   

    //IMAGES

    //update item image
    app.put('/item/updateImage/:itemID', item.put);

    // Retrieve all items images
    app.get('/item/findAllImages', item.findAllImages);                 //Done

    // Retrieve a single item image with id
    app.get('/item/findOneImage/:itemID', item.findOneImage);           //Done

    // Retrieve items images by filter
    app.get('/item/findImageWithCondition', item.findWithCondition);    






}