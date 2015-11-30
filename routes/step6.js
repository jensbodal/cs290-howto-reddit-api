var express = require('express');
var router = express.Router();

/* GET step6 page. */
router.get('/', function(req, res, next) {
  res.render('step6', { title: 'Express' });
});

module.exports = router;
