const express = require('express');
const path = require('path');

require("./utils/connectDB");

const Student = require("./models/Student");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const publicDirPath = path.join(__dirname, './public');
app.use(express.static(publicDirPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// GET localhost:3000/ -> Home page rendering
app.get("/", (req, res) => {
  res.render('index');
});

// GET /browse 
// If auth => logout
// Else => login
app.get("/browse", (req, res) => {
  res.render('browse');
});

// GET /login -> render common login page
app.get("/login", (req, res) => {
  res.render('login');
});

app.post("/login/student", (req, res) => {});

// GET /register -> render student register page
app.get("/register", (req, res) => {
  res.render('register');
});

// POST /register -> Student register
app.post("/register", async (req, res) => {
  const student = Student(req.body);

  try {
    await student.save();
    const token = await student.generateAuthToken();
    student.tokens.push({ token });
    res.redirect('/student/home');
  } catch (e) {
    console.log(e)
  }
});

app.get("/student/home", (req, res) => {
  res.render('studentlanding');
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

// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'contact.auctionport@gmail.com',
//     pass: 'YrtHFiTinUfK5u7'
//   }
// });

// var mailOptions = {
//   from: 'contact.auctionport@gmail.com',
//   to: 'contact.auctionport@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// POST /contact -> handles the form data and forward it to mail

//admin
//seller
//bidder
//register
//login
