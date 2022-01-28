const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Mongoose = require('mongoose');
//const proxy = require('express-http-proxy');
//const { createProxyMiddleware } = require('http-proxy-middleware');
const request = require('request');

const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Auction = require('../models/Auction');


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

router.get("/student/seller/home", auth ,async (req, res) => {
    try {
        if (req.isAuth) {
            if (req.decoded.type === 'student') {
                const categories = await Category.find();
                const auctions = await Auction.find({sellerId : req.decoded._id});
                const products = await Product.find({sellerId : req.decoded._id});
                const students = await Student.find();
                res.render('seller', { categories, auctions, products, students });
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

router.get("/browse", auth ,async (req, res) => {
    try {
        if (req.isAuth) {
            if (req.decoded.type === 'student') {
                const categories = await Category.find();
                const auctions = await Auction.find();
                const students = await Student.find();
                const products = await Product.find();
                res.render('browse', { categories, auctions, products, students, isAuth : req.isAuth });
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

router.get("/browse/:category", auth ,async (req, res) => {
    try {
        if (req.isAuth) {
            if (req.decoded.type === 'student') {
                const categories = await Category.find();
                var filterCategory;
                categories.forEach(category => {
                    if(category.categoryName == req.params.category)
                        filterCategory = category._id;
                });
                const products = await Product.find({categoryId : filterCategory});

                const auctions = await Auction.find();
                var filterAuctions = [];
                auctions.forEach(auction => {
                    products.forEach(product => {
                        if(auction.productId.toString() == product._id.toString())
                            filterAuctions.push(auction);
                    });
                });
                const students = await Student.find();
                var filterStudents = [];
                filterAuctions.forEach(auction => {
                    students.forEach(student => {
                        if(auction.sellerId.toString() == student._id.toString())
                            filterStudents.push(student);
                    });
                });
                res.render('browse', { categories, auctions : filterAuctions, products, students : filterStudents, isAuth : req.isAuth });
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

const upload = multer({
    // limits : {
    //     fileSize : 1000000
    // },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error("Upload .jpg, .jpeg, .png"));
        cb(undefined, true);
    }
});

router.post("/student/seller/create-auction", auth, upload.single('productImg'), async (req, res) => {
    try {
        const category = await Category.findOne({ categoryId: req.body.categoryId });
        //console.log(category);
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        const product = Product({
            productName: req.body.productName,
            categoryId: category._id,
            sellerId: Mongoose.Types.ObjectId(req.decoded._id),
            productDesc: req.body.productDesc,
            productImg: buffer
        });
        await product.save();
        //console.log(product);

        const auction = Auction({
            productId: product._id,
            sellerId: Mongoose.Types.ObjectId(req.decoded._id),
            openingBid: req.body.openingBid,
            auctionDate: req.body.auctionDate
        });
        await auction.save();
        //console.log(auction);

        res.redirect('/student/seller/home');
    } catch (e) {
        console.log(e);
    }
});

router.get("/student/enter-auction/:id", auth, (req, res) => {
    res.redirect("/proxy");
});

router.get("/student/seller/start-auction/:id", auth, async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        auction.startTime = new Date();
        await auction.save();
        console.log("Starting auction");
        console.log(auction);
        res.redirect("/proxy");
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;