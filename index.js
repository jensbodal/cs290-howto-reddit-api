var request = ('request');

var request = require('request').defaults({
    json: true
})
var stream = require('stream')
var url = require('url')
var qs = require('querystring')
var redditStats = require('measured').createCollection();

var requests_per_second = function() {
    try {
        var reqsPerSec = redditStats.toJSON().requestsPerSecond.mean;
    } catch (err) {
        var reqsPerSec = 0;
    }
    return reqsPerSec;
}

module.exports = function(username, lastParsed) {
    if (lastParsed === null || lastParsed === undefined) lastParsed = 0;
    var last = '';
    var started = false;
    var readStream = new stream.Readable({
        objectMode: true
    });

    function pullJSON(path, callback) {
        redditStats.meter('requestsPerSecond').mark();
        request({
            url: 'http://www.reddit.com/' + path,
            json: true
        }, callback);
    }

    function userJSON(username) {
        var username_path = 'user/' + username + '/about.json';
        pullJSON(username_path, function(error, res, user_data) {
            //console.log(error, res, user_data);
            if (error || user_data.error) {
                readStream.emit('error', 'user_not_found');
            } else {
                try {
                    var userObj = {};
                    userObj.username = user_data.data.name;
                    userObj.created = user_data.data.created;
                    userObj.link_karma = user_data.data.link_karma;
                    userObj.comment_karma = user_data.data.comment_karma;
                    userObj.kind = 'usr';
                    readStream.emit('user', userObj);
                } catch (err) {
                    readStream.emit('error', 'user_not_found');
                }

            };
        });
    };
    //
    function exportUserHistory(username, next) {
        var path = '/user/' + username + '/.json?limit=100&after=' + last
        pullJSON(path, function(err, res, body) {
            if (err || body.error) {
                return next;
                readStream.emit('error', err, body);
            }
            try {
                last = body.data.after
                var count = 0
                body.data.children.forEach(function(item) {
                    if (item.data.created > lastParsed) {
                        if (item.kind === 't1') readStream.emit('comment', item);
                        if (item.kind === 't3') readStream.emit('submission', item);
                        readStream.push(item);
                        count++;
                    } else {
                        body.data.after = null;
                    }
                });
                readStream.emit('page', last, count);
                if (body.data.after) next();
                else readStream.push(null)

            } catch (err) {
                readStream.emit('error', err, body);
            }
        });
    }
    setTimeout(function() {
        readStream.emit('metrics', requests_per_second());
    }, 5 * 1000);

    function loop() {
        exportUserHistory(username, function(err) {
            if (err) return console.log(err);
            setTimeout(loop, 2000);
        });
    }
    readStream._read = function(n) {
        if (!started) loop();
        if (!started) userJSON(username);
        started = true;
    };
    return readStream
};
