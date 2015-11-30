var express = require('express');
var router = express.Router();

/* GET step4 page. */
router.get('/', function(req, res, next) {
  res.render('step4', { title: 'Express' });
});

module.exports = router;
