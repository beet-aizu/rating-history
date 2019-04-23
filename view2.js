var colors = {
    'atcoder': [
        {color:'#808080', min:-9999, max: 399, title:'灰' },
        {color:'#804000', min: 400, max: 799, title:'茶' },
        {color:'#008000', min: 800, max:1199, title:'緑' },
        {color:'#00C0C0', min:1200, max:1599, title:'水' },
        {color:'#0000FF', min:1600, max:1999, title:'青' },
        {color:'#C0C000', min:2000, max:2399, title:'黄' },
        {color:'#FF8000', min:2400, max:2799, title:'橙' },
        {color:'#FF0000', min:2800, max:9999, title:'赤' }
    ]
};



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

$(function()
  {
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
      
	    getJson(url).done(function(data)
                        {                            
                            var sum0 = [0, 0, 0, 0];
                            var sum1 = [0, 0, 0, 0];
                            var sum2 = [0, 0, 0, 0];
                            var sum3 = [0, 0, 0, 0];
                            var sum4 = [0, 0, 0, 0];
                            
                            for(var i = 0; i < data.length; i++ ) {
                                var isRated = data[i].IsRated;
                                var date = data[i].EndTime;
                                var name = data[i].ContestName;
                                var rank = data[i].Place;
                                var perf = data[i].Performance;
                                if(new Date(date) < dt) continue;

                                if(name.indexOf("Grand Contest") != -1) {
                                    sum1[0]++;
                                    sum1[1] += parseInt(rank);
                                    if(isRated) {
                                        sum1[2]++;
                                        sum1[3] += parseInt(perf);
                                    }
                                } else if(name.indexOf("Regular Contest") != -1) {
                                    sum2[0]++;
                                    sum2[1] += parseInt(rank);
                                    if(isRated) {
                                        sum2[2]++;
                                        sum2[3] += parseInt(perf);
                                    }
                                } else if(name.indexOf("Beginner Contest") != -1) {
                                    sum3[0]++;
                                    sum3[1] += parseInt(rank);
                                    if(isRated) {
                                        sum3[2]++;
                                        sum3[3] += parseInt(perf);
                                    }
                                } else {
                                    sum4[0]++;
                                    sum4[1] += parseInt(rank);
                                    if(isRated) {
                                        sum4[2]++;
                                        sum4[3] += parseInt(perf);
                                    }
                                }

                                sum0[0]++;
                                sum0[1] += parseInt(rank);
                                if(isRated) {
                                    sum0[2]++;
                                    sum0[3] += parseInt(perf);
                                }
                            }
                            console.log(sum0);

                            setRatingHtml("atcoder", "#now_all", sum0);
                            setRatingHtml("atcoder", "#now_agc", sum1);
                            setRatingHtml("atcoder", "#now_arc", sum2);
                            setRatingHtml("atcoder", "#now_abc", sum3);
                            setRatingHtml("atcoder", "#now_oth", sum4);

                            var tweet = "平均";
                            if(lattemalta != 1333) tweet += " 直近"+lattemalta+"ヶ月";
                            tweet += "\n";
                            tweet += $("#now_all").text() + "\n";
                            tweet += "AGC: " + $("#now_agc").text() + "\n";
                            tweet += "ARC: " + $("#now_arc").text() + "\n";
                            tweet += "ABC: " + $("#now_abc").text() + "\n";
                            tweet += "Other: " + $("#now_oth").text() + "\n"; 
                            $.fn.appendTweetButton = function(url, text){
                                $(this).append($("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\""+url+"\" data-text=\""+text+"\" data-count=\"vertical\">Tweet<\/a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');<\/script>"));
                            };
                            //Tweetボタンの設置
                            $("body").appendTweetButton($(location).attr('href'), tweet);

                            //tweet += $("#now_oth").text() + "\n";
                            
                        }).fail(function(data)
                                {
                                    setRatingHtml("atcoder", "#now_all", [0,0,0,0]);

                                });
  });


function getRatingLine(site, rating)
{
    for(var i = 0; i < colors[site].length; i++) {
        var line = colors[site][i];
        if(line.min <= rating && rating <= line.max) return(line);
    }
    return(null);
}

// 要素名 component に値 rating をセットする
function setRatingHtml(site, component, rating)
{
    if(rating[0] == 0) {
        $(component).text("-");
        return;
    }

    if(rating[2] == 0) {
        $(component).text((rating[1]/rating[0]).toFixed(1) + "位");
        return;
    }

    var line = getRatingLine(site, rating[3]/rating[2]);

    $(component).css('color', line.color);
    $(component).text((rating[1]/rating[0]).toFixed(1) + " 位 " + (rating[3]/rating[2]).toFixed(1)+ "("+line.title+ ")");
};

