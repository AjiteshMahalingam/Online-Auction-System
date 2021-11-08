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

app.listen(port, () => {
  console.log("Server is up on port : " + port);
});

// POST /contact -> handles the form data and forward it to mail

//admin
//seller
//bidder
//register
//login
