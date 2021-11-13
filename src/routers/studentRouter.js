const express = require('express');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Category = require('../models/Category');

const router = new express.Router();

router.get("/student/home", auth, (req, res) => {
    if (req.isAuth)
        if (req.decoded.type === 'student')
            res.render('studentlanding');
        else
            res.send({ "Status": "404" });
    else
        res.redirect("/login");
});

router.post("/student/login", async (req, res) => {
    try {
        const student = await Student.findByCredentials(req.body.email, req.body.password);
        const token = await student.generateAuthToken();
        student.tokens.push({ token });
        await student.save();

        res.cookie('token', token, { httpOnly: true, maxAge: 2629800000 });
        res.redirect('/student/home');
    } catch (e) {
        console.log(e);
    }
});

router.post("/student/logout", auth, async (req, res) => {
    try {
        if (req.isAuth) {
            const student = await Student.findOne({ _id: req.decoded._id });
            student.tokens = student.tokens.filter(token => token.token != req.cookies.token);
            await student.save();

            res.redirect('/login');
        } else {
            res.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// POST /student/register -> Student register
router.post("/student/register", async (req, res) => {
    const student = Student(req.body);

    try {
        await student.save();
        const token = await student.generateAuthToken();
        student.tokens.push({ token });
        await student.save();

        res.cookie('token', token, { httpOnly: true, maxAge: 2629800000 });
        res.redirect('/student/home');
    } catch (e) {
        console.log(e)
    }
});

router.get("/student/profile", auth, async (req, res) => {
    try {
        if (req.isAuth) {
            if (req.decoded.type === 'student') {
                const student = await Student.findOne({ _id: req.decoded._id });
                //console.log(student);
                res.render('userprofile', { student: student });
            } else {
                res.send({ "Status": "404" });
            }
        }
        else
            res.redirect("/login");
    } catch (e) {
        console.log(e);
    }
});

router.get("/student/seller/home", auth, async (req, res) => {
    try {
        if (req.isAuth) {
            if (req.decoded.type === 'student') {
                const categories = await Category.find();
                res.render('seller', {categories});
            } else {
                res.send({ "Status": "404" });
            }
        }
        else
            res.redirect("/login");
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;