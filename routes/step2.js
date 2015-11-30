var express = require('express');
var router = express.Router();

/* GET step2 page. */
router.get('/', function(req, res, next) {
  res.render('step2', { title: 'Step 2' });
});

module.exports = router;
