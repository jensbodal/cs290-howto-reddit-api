var express = require('express');
var router = express.Router();

/* GET step3 page. */
router.get('/', function(req, res, next) {
  res.render('step3', { title: 'Express' });
});

module.exports = router;