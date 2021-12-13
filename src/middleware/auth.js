const jwtExp = require('express-jwt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    jwtExp({
        secret: 'ac780bcd612258fe876474db066bd186dd3d70a32cc173db964e',
        algorithms: ['RS256'],
        getToken: req => req.cookies.token
    });
    try {
        const decoded = jwt.verify(req.cookies.token, 'ac780bcd612258fe876474db066bd186dd3d70a32cc173db964e');
        var user;
        var isAuth = false;
        if(decoded.type == "student"){
            user = await Student.findOne({ _id: decoded._id });
            user.tokens.map(token => {
                if(token.token === req.cookies.token)
                    isAuth = true;
            });
        }
        else if (decoded.type == "admin"){
            user = await Admin.findOne({ _id: decoded._id });
            user.tokens.map(token => {
                if(token.token === req.cookies.token)
                    isAuth = true;
            });
        }
        req.isAuth = isAuth;
        req.decoded = decoded;
        return next();

    } catch (e) {
        console.log(e);
        //console.log("test");
        return next();
    }
};

module.exports = auth;