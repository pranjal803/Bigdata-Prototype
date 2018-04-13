const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    var token = jwt.sign({
      user: 'pranjal'
    }, 'shhh', { expiresIn: 30 * 24 * 60 * 60 });

    console.log(token);
    res.status(201).send(token);

});

module.exports = router;