var jwt = require('jsonwebtoken');

function authenticate(req, res, next) {

    var token = req.headers.authorization;

    if (!token) {
        res.status(401).send('Authorization Error');
        return;
    }

    try {
        var info = jwt.verify(token, 'shhh');
        next();
    } catch (e) {

        res.status(401).send('Authorization Error');
        return;
    }
}

module.exports = {
    authenticate
}