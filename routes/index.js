var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Reddit API How-To' });
});

router.post('/authorize_reddit', function(req, res) {
    var post_url = "https://www.reddit.com/api/v1/access_token";
    var context = getContext('POST', req, true);
    var grant_type = context.params[0].value;
    var code = context.params[1].value;
    var redirect_uri = context.params[2].value;
    var client_id = context.params[3].value;
    var secret = "XHC5nra5YLYGAkMblwjeNZai_YE";
    var tt = {
        post_url: post_url,
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        secret: secret
    }

    var payload = {
        type: "POST",
        url: post_url,
        dataType: "JSON",
        data: {
            code: "asdf"        
        },
        username: client_id,
        password: secret,
        crossDomain: true,
        beforeSend: function(xhr){
            console.log("Called before SEND!!");
            xhr.setRequestHeader(
                'Authorization', 
                'Basic ' + btoa(username + ":" + secret)
            );
        }
    }
    res.send(tt);
});

router.get('/step2', function(req, res) {
    var context = getContext('GET', req, false);
    var oneTimeCode = context.params[0].value;
    res.render('step2', {pageData: ["", oneTimeCode]});
});

router.get('/step:number', function(req, res) {
    var stepNumber = req.params.number;
    try {
        res.render('step' + stepNumber, {
            pageData: ["","","","",""],
            title: "Step #" + stepNumber});
    }
    catch(err) {
        res.send("Something went wrong :(");
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
