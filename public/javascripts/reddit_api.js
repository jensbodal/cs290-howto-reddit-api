document.addEventListener('DOMContentLoaded', sample_api_call, false);

function sample_api_call() {
    $("#api-me-button").click(function(event) {
        event.preventDefault();
        var access_token = document.getElementById("inputForm").elements["access_token"].value;
        console.log(access_token);
        console.log("Clicked");
        var url = "https://oauth.reddit.com/api/v1/me";
        
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            headers: {
                "Authorization" : "bearer " + access_token,
                "User-Agent" : "cs290-howto-reddit-api/0.1 by osu-test",
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            success: function(msg) {
                $('#sample-return-area').text(JSON.stringify(msg, null, 2));
                console.log(msg);
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    });
}

$(document).ready(function() {
    $("#test-button").click(function(event) {
        event.preventDefault();
        console.log("Clicked");
        var content = $("#sample-return-area");
        content.html("<b>Hi</b>");
    });
});
