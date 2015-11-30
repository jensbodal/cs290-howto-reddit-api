var express = require('express');
var router = express.Router();

/* GET step9 page. */
router.get('/', function(req, res, next) {
  res.render('step9', { title: 'Express' });
});

module.exports = router;
