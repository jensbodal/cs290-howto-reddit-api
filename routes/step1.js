var express = require('express');
var router = express.Router();

/* GET step1 page. */
router.get('/', function(req, res, next) {
  res.render('step1', { title: 'Step 1' });
});

module.exports = router;
