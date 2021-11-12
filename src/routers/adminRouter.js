const express = require('express');
const auth = require('../middleware/auth');
const Admin = require('../models/Admin');

const router = new express.Router();

router.get("/admin/home", auth, (req, res) => {
    if (req.isAuth)
      if (req.decoded.type === 'admin')
        res.render('admin');
      else
        res.send({ "Status": "404" });
    else
      res.redirect("/login");
  });
  
  router.post("/admin/login", async (req, res) => {
    try {
      const admin = await Admin.findByCredentials(req.body.email, req.body.password);
      const token = await admin.generateAuthToken();
      admin.tokens.push({ token });
      await admin.save();
  
      res.cookie('token', token, { httpOnly: true });
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
  

module.exports = router;