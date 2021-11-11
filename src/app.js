const express = require('express');
const path = require('path');
//const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');

require("./utils/connectDB");

const Student = require("./models/Student");
const Admin = require("./models/Admin");
const auth = require("./middleware/auth");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

const publicDirPath = path.join(__dirname, './public');
app.use(express.static(publicDirPath));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

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

// GET /register -> render student register page
app.get("/register", (req, res) => {
  res.render('register');
});

// GET /login -> render common login page
app.get("/login", (req, res) => {
  res.render('login');
});

app.post("/student/login", async (req, res) => {
  try{
    const student = await Student.findByCredentials(req.body.email, req.body.password);
    const token = await student.generateAuthToken();
    student.tokens.push({ token });
    await student.save();

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/student/home');
} catch (e) {
    console.log(e);
}
});

app.post("/student/logout", auth, async (req, res) => {
  try {
    console.log(req.isAuth);
    if (req.isAuth === true){
      if(req.decoded.type === 'student'){
        const student = await Student.findOne({ _id: req.decoded._id});
        
        student.tokens = student.tokens.filter(token => token.token != req.cookies.token);
        await student.save();
        console.log(student);
      }
      else if (req.decoded.type === 'admin') {
        const admin = await Admin.findOne({ _id: req.decoded._id});
        admin.tokens = admin.tokens.filter(token => token.token != req.token);
        await admin.save();
      }      
      res.redirect('/login');
    } else {
      res.redirect("/");
    }
  } catch (e) {

  }
});



// POST /student/register -> Student register
app.post("/student/register", async (req, res) => {
  const student = Student(req.body);

  try {
    await student.save();
    const token = await student.generateAuthToken();
    student.tokens.push({ token });
    await student.save();

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/student/home');
  } catch (e) {
    console.log(e)
  }
});

app.get("/student/home", auth, (req, res) => {
  if(req.isAuth)
    res.render('studentlanding');
  else
    res.redirect("/login");
});

// POST /contact -> handles the form data and forward it to mail
app.post("/contact", (req, res) => {
  // Mail function
  res.redirect('/');
});
app.get("/test", (req, res) => {
  console.log("From fetch request.");
  console.log(req.headers);
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
