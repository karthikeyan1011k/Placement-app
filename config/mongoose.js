const mongoose  = require('mongoose');

//connect to MongoDB cloud URI
mongoose.connect("mongodb+srv://karthikeyan1011k:semPPBy0sewCA7KQ@cluster0.xh3vjnn.mongodb.net/?retryWrites=true&w=majority");

//acquire the connection 
const db = mongoose.connection;

//if error
db.on("error", function(err){console.log(`Error in connecting to DB: ${err}`)});

//successfully connected
db.once('open',()=>{
    console.log('Successfully connected to db');
});

//export
module.exports = db;
