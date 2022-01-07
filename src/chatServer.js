// const io = require("socket.io")(3500);
// io.on('connection', (socket) => {
//     console.log('New connection established');
//   });

//   io.listen(3500);

const express = require('express');
const http = require('http');
const io = require('socket.io');
const path = require('path');
const url = require('url');

require("./utils/connectDB");
const Student = require('./models/Student');
const Product = require('./models/Product');
const Auction = require('./models/Auction');
const app = express();
const PORT = 3500;
const server = http.createServer(app);
//const io = socketio(server);
const io = new Socketio();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const publicDirPath = path.join(__dirname, './public');
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    console.log('New connection established');
});

app.get('/auction', async (req, res) => {
    try {
        const queryParams = url.parse(req.url, true).query;
        //console.log(queryParams);
        const auction = await Auction.findById(queryParams.auctionId);
        const seller = await Student.findById(queryParams.studentId);
        const product = await Product.findById(auction.productId);
        res.render('auction', {auction, seller, title: product.productName, sellerName : seller.name, openingBid: auction.openingBid, image : product.productImg});
    } catch (e) {
        console.log(e);
    }
    
});

server.listen(PORT, () => {
    console.log('Server is up at port : ' + PORT);
});

