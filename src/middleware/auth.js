const jwt = require('express-jwt');

const auth = async (req, res, next) => {
    jwt({
        secret: 'ac780bcd612258fe876474db066bd186dd3d70a32cc173db964e',
        algorithms: ['RS256'],
        getToken: req => req.cookies.token
    });
    try {
        const decoded = jwt.verify(req.cookies.token, 'thisistorvus');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user)
            req.isAuth = false
        else {
            req.isAuth = true;
            req.user = user;
            req.token = token;
        }
        next();

    } catch (e) {
        next();
    }
    next();
};

module.exports = auth;