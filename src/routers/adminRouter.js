const express = require('express');
const auth = require('../middleware/auth');
const Admin = require('../models/Admin');
const Feedback = require("../models/Feedback");
const Student = require("../models/Student");
const Category = require("../models/Category");
const Auction = require("../models/Auction");
const Product = require("../models/Product");

const router = new express.Router();

router.get("/admin/home", auth, async (req, res) => {
  if (req.isAuth) {
    if (req.decoded.type === 'admin') {
      const feedbacks = await Feedback.find();
      const students = await Student.find();
      const categories = await Category.find();
      const auctions = await Auction.find();
      const products = await Product.find();
      res.render('admin', { students, feedbacks,  categories, auctions, products});
    }
    else
      res.send({ "Status": "404" });
  }
  else {
    res.redirect("/login");
  }

});

router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(req.body.email, req.body.password);
    const token = await admin.generateAuthToken();
    admin.tokens.push({ token });
    await admin.save();

    res.cookie('token', token, { httpOnly: true, maxAge: 2629800000 });
    res.redirect('/admin/home');
  } catch (e) {
    console.log(e);
  }
});

router.post("/admin/logout", auth, async (req, res) => {
  try {
    if (req.isAuth) {
      const admin = await Admin.findOne({ _id: req.decoded._id });
      admin.tokens = admin.tokens.filter(token => token.token != req.cookies.token);

      await admin.save();
      res.redirect('/login');
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/admin/acceptAuction/:id', async(req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    auction.isAccepted = true;
    await auction.save();
    console.log(auction);
    res.redirect("/admin/home");
  } catch(e) {
    console.log(e);
  }
});

router.post('/admin/rejectAuction/:id', async(req, res) => {
  try {
    await Auction.findByIdAndRemove(req.params.id);
    res.redirect("/admin/home");
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;