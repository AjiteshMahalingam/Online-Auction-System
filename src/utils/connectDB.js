const Mongoose = require('mongoose');

Mongoose.connect('mongodb+srv://Torvus:Aji1407MERN@cluster-1.bwhtr.mongodb.net/Auction_DB?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});