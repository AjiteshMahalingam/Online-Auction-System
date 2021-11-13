const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

require("./utils/connectDB");

const Feedback = require("./models/Feedback");
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

app.get("/browse", auth, (req, res) => {
  if (req.decoded.type === 'student')
    res.render('browse', { isAuth: req.isAuth });
  else
    res.redirect('/admin/home');

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

// app.get('/seller', async (req, res) => {
//   try {
//     const allFeedbacks = await Feedback.find();
//     const student = await Student.findById();
//     res.render('seller', { feedbacks : allFeedbacks});
//   } catch (e) {
//     console.log(e);
//   }
// });
app.use(studentRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log("Server is up on port : " + port);
});

