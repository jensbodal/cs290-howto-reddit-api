var express = require('express');
var router = express.Router();

/* GET step7 page. */
router.get('/', function(req, res, next) {
  res.render('step7', { title: 'Express' });
});

module.exports = router;
