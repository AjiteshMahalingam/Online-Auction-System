const express = require('express');
const path = require('path');
//require("./utils/connectDB");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const publicDirPath = path.join(__dirname, './public');
app.use(express.static(publicDirPath));

app.use(express.urlencoded({extended: false}));

// GET localhost:3000/ -> Home page rendering
app.get("/", (req, res) => {
  res.render('index');
});
// POST /contact -> handles the form data and forward it to mail
app.post("/contact", (req, res) => {
  // Mail function
  res.redirect('/');
});

//GET /browse
//GET /browse
//GET /register/student
//GET /login/student
//GET /login/admin
//POST /register/student
//POST /login/student
//POST /login/admin

//[GET] /adminDashboard ::  admin landing page after login
//[GET] /student :: student landing page after login
//[GET] /student/profile :: view student profile
//[GET] /student/bidder/browse
//[GET] /student/seller
//[UPDATE] /student/profile 



app.listen(port, () => {
  console.log("Server is up on port : " + port);
});

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.auctionport@gmail.com',
    pass: 'YrtHFiTinUfK5u7'
  }
});

var mailOptions = {
  from: 'contact.auctionport@gmail.com',
  to: 'contact.auctionport@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 

// POST /contact -> handles the form data and forward it to mail

//admin
//seller
//bidder
//register
//login
