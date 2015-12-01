var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Reddit API How-To' });
});

router.get('/step:number', function(req, res) {
    var stepNumber = req.params.number;
    try {
        res.render('step' + stepNumber, {title: 'Step #' + stepNumber});
    }
    catch(err) {
        res.send("NONONONONON");
    }
});

router.get('/jensbodal', function(req, res) {
    res.send("This page does not exist");
});

router.get('/one-time-code', function(req, res, next) {
    var context = getContext('GET', req, false);
    var state = context.params[0].value; // we should verify this, but we don't
    var oneTimeCode = context.params[1].value;
    res.render('step1', {pageData: [state, oneTimeCode]});
    next();
});

function getContext(type, req, isPost) {
    var params = [];
    if (isPost) {
        reqType = req.body;
    }
    else {
        reqType = req.query;
    }
    for (var param in reqType) {
        params.push({'name':param, 'value':reqType[param]});
    }
    var context = {};
    context.params = params;
    context.type = type;
    return context;
}

module.exports = router;
