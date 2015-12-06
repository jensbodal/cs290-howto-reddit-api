var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');
var async = require('async');
var querystring = require('querystring'); 
var https = require('https');
var $ = require('jquery');

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
    var secret = config.reddit.secret;


    var payload = {
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri,
    }

    var payload_data = querystring.stringify(payload);
    var contentLength = payload_data.length;
    
    var username, password, url, auth;

    request(
        {
            method: 'POST',
            uri: post_url,
            body: payload_data,
            headers: {
                "User-Agent" : "cs290-howto-reddit-api/0.1 by osu-test"
            },
            auth: {
                username: client_id,
                password: secret
            }
        },
        function (err, iRes, body) {
            var auth_res = JSON.parse(iRes.body);
            var access_token = auth_res.access_token;
            var token_type = auth_res.token_type;
            var scope = auth_res.scope;
            console.log(access_token);
            res.render('step2', {pageData: [access_token, code, token_type, scope]});
        }
    );
});

router.post('/reddit_api', function(req, res) {
    var context = getContext('POST', req, true);
    var access_token = context.params[0].value;
    var post_uri = "https://oath.reddit.com/api/v1/me";
    var state = "this_is_random_string";
    
    if(typeof $ == 'undefined') {
        console.log("Not working");
    }

    else {
        console.log("Working");
    }

    $.ajax({
        type: 'GET',
        url: post_uri,
        dataType: 'jsonp',
        headers: {
            "Authorization" : "bearer " + new Buffer(access_token, "utf8").toString("base64"),
            "User-Agent" : "cs290-howto-reddit-api/0.1 by osu-test",
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        jsonpCallback: 'thecall',
        success: function(msg) {

        },
        error: function(msg) {

        }
    });
/*    
    request({
        uri: post_uri,
        crossDomain: true,
        headers: {
            "Authorization" : "bearer " + new Buffer(access_token, "utf8").toString("base64"),
            "User-Agent" : "cs290-howto-reddit-api/0.1 by osu-test",
            "Content-Type" : "application/x-www-form-urlencoded"
        }

    }, function (err, inner_res, body) {
        var info = JSON.parse(body);
        console.log(inner_res);
        res.send(inner_res);
    });
*/

});

function thecall(msg) {
    console.log("We are trigging");
}

router.get('/step2', function(req, res) {
    var context = getContext('GET', req, false);
    if (context.params.length > 0) {
        var oneTimeCode = context.params[0].value;
    }
    else {
        var oneTimeCode = "";
    }
    res.render('step2', {pageData: ["", oneTimeCode]});
});

router.get('/step3', function(req, res) {
    var context = getContext('GET', req, false);
    if (context.params.length > 0) {
        var access_token = context.params[0].value;
    }
    else {
        var access_token = "";
    }
    res.render('step3', {pageData: [access_token]});
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
