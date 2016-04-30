var express = require('express');
var mustBe = require('mustbe').routeHelpers();

var router = express.Router();

/* GET users listing. */
router.get('/', mustBe.authenticated(), function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;