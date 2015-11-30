var express = require('express');
var router = express.Router();

/* GET step5 page. */
router.get('/', function(req, res, next) {
  res.render('step5', { title: 'Express' });
});

module.exports = router;
