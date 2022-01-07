const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const proxy = require("express-http-proxy");

require("./utils/connectDB");

const Feedback = require("./models/Feedback");
const Student = require('./models/Student');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Auction = require('./models/Auction');
const auth = require("./middleware/auth");
const studentRouter = require("./routers/studentRouter");
const adminRouter = require('./routers/adminRouter');

const app = express();


const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const publicDirPath = path.join(__dirname, './public');
app.use(express.static(publicDirPath));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", auth, (req, res) => {
  res.render('index', { isAuth: req.isAuth, type: req.decoded.type });
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", auth, (req, res) => {
  if (!req.isAuth)
    res.render('login');
  else
    res.send({ "Message": "Already logged-in" });

});

app.post("/contact", async (req, res) => {
  try {
    const feedback = Feedback(req.body);
    await feedback.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

app.get("/auction/:id", auth, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    //console.log(auction);
    const product = await Product.findById(auction.productId);
    //console.log(product);
    const seller = await Student.findById(auction.sellerId);
    //console.log(seller);
    res.render('auction', {auctionId : req.params.id, title: product.productName, sellerName : seller.name, openingBid: auction.openingBid, image : product.productImg});
  } catch (e) {
    console.log(e);
  }
});
app.use(studentRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log("Server is up on port : " + port);
});




