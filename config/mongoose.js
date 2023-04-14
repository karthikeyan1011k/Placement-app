const mongoose  = require('mongoose');

//connect to MongoDB cloud URI
mongoose.connect("mongodb://127.0.0.1:27017/Placement_cell_app");

//acquire the connection 
const db = mongoose.connection;

//if error
db.on("error", function(err){console.log(`Error in connecting to DB: ${err}`)});

//successfully conneted
db.once('open',()=>{
    console.log('Successfully connected to db');
});

//export
module.exports = db;