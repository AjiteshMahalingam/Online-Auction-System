const Mongoose = require('mongoose');

Mongoose.connect( 'mongodb+srv://Torvus:Aji1407MERN@cluster-1.bwhtr.mongodb.net/Auction_DB?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology: true
});

// C:\Users\Home\mongodb\bin\mongod.exe --dbpath=C:\Users\Home\mongodb-data
// mongodb://127.0.0.1/auction-port
// mongodb://127.0.0.1/task-manager-api
// mongodb+srv://Torvus:Aji1407MERN@cluster-1.bwhtr.mongodb.net/Auction_DB?retryWrites=true&w=majority