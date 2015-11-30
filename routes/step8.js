var express = require('express');
var router = express.Router();

/* GET step8 page. */
router.get('/', function(req, res, next) {
  res.render('step8', { title: 'Express' });
});

module.exports = router;
