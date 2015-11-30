var express = require('express');
var router = express.Router();

/* GET step10 page. */
router.get('/', function(req, res, next) {
  res.render('step10', { title: 'Express' });
});

module.exports = router;
