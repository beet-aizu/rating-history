function getJson(url){
    return $.ajax(
	{
	    type     : 'GET',
	    url      : url,
	    dataType : 'json',
	    timeout  : 20000,
	    cache    : false,
	});
}

$(function(){
    var handle = undefined, enemy = undefined;
    var match = location.search.match(/handle=(.*?)(&|$)/);
    if(match) {
        handle = decodeURIComponent(match[1]);
        $('#handle').val(handle);
    }
    if(handle === undefined) return;

    var lattemalta = 1333;
    var beet = location.search.match(/number=([0-9]+)(&|$)/);
    if(beet) {
        lattemalta = decodeURIComponent(beet[1]);
        $('#number').val(lattemalta);
    }
    if(lattemalta > 1333) lattemalta = 1333;

    var dt = new Date();
    dt.setMonth(dt.getMonth() - lattemalta);

    var url =
        "ajax.php?url=https://atcoder.jp/users/"
        + handle
        + "/history/json";

    getJson(url).done(function(data){
        var sum0 = 0;
        var sum1 = 0;
        var sum2 = 0;
        var sum3 = 0;
        var sum4 = 0;

        for(var i = 0; i < data.length; i++ ) {
            var isRated = data[i].IsRated;
            var date = data[i].EndTime;
            var name = data[i].ContestName;
	    var diff = data[i].NewRating - data[i].OldRating;
            if(new Date(date) < dt) continue;

            if(isRated) sum0 += parseInt(perf);

            if(name.indexOf("Grand Contest") != -1) {
                if(isRated) sum1 += parseInt(perf);
            } else if(name.indexOf("Regular Contest") != -1) {
                if(isRated) sum2 += parseInt(perf);
            } else if(name.indexOf("Beginner Contest") != -1) {
                if(isRated) sum3 += parseInt(perf);
            } else {
                if(isRated) sum4 += parseInt(perf);
            }
        }

        $("#now_all").text(sum0);
        $("#now_agc").text(sum1);
        $("#now_arc").text(sum2);
        $("#now_abc").text(sum3);
        $("#now_oth").text(sum4);

        var tweet = "あなたのレートはどこから？\n私は";
        tweet += "AGC: " + $("#now_agc").text() + "\n";
        tweet += "ARC: " + $("#now_arc").text() + "\n";
        tweet += "ABC: " + $("#now_abc").text() + "\n";
        tweet += "Other: " + $("#now_oth").text() + "\n";
        if(lattemalta != 1333) tweet += "(直近"+lattemalta+"ヶ月)";
        $.fn.appendTweetButton = function(url, text){
            $(this).append($("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\""+url+"\" data-text=\""+text+"\" data-count=\"vertical\">Tweet<\/a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');<\/script>"));
        };
        //Tweetボタンの設置
        $("div").appendTweetButton($(location).attr('href'), tweet);
    });
});
