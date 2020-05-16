var rated = ["topcoder", "codeforces", "atcoder"];
var history, line, cnt;

var onlinejudge = ["topcoder", "codeforces", "atcoder", "aoj", "yukicoder", "librarychecker"];
var solved, num;

function getJson(url){
    return $.ajax(
	{
	    type     : 'GET',
	    url      : url,
	    dataType : 'json',
	    timeout  : 20000,
	});
}

function getHandle(cite){
    return document.getElementById("handle_" + cite).value;
}

function getHistoryUrl(cite, handle){
    if(cite == "topcoder")
	return "https://api.topcoder.com/v2/users/"
        + handle
        + "/statistics/data/srm";

    if(cite == "codeforces")
	return "https://codeforces.com/api/user.rating?handle=" + handle;

    if(cite == "atcoder")
	return "ajax.php?url=https://atcoder.jp/users/"
        + handle
        + "/history/json";
}

function getHistory(cite){
    var handle = getHandle(cite);
    if(handle == ""){
	cnt++;
	drawGraphs();
	return;
    }
    var url = getHistoryUrl(cite, handle);
    getJson(url).done(function(data){
	history[cite] = data;
    }).fail(function(data){
	alert("Failed " + cite);
    }).always(function(data){
        cnt++;
        drawGraphs();
    });
}

function drawGraphs(){
    if(cnt < rated.length) return;
    if(history.size == 0) return;

    if(history['topcoder']){
	var json = history['topcoder'].History;
	line['topcoder'] = [];
	for(i = 0; i < json.length; i++){
	    var tmp = json[i].date.replace(/\./g,"/");
	    line['topcoder'].push({
		"x": new Date(tmp).getTime() / 1000,
		"y": json[i].rating
	    });
	}
    }

    if(history['codeforces']){
	var json = history['codeforces'].result;
	line['codeforces'] = [];
	for(i = 0; i < json.length; i++){
	    line['codeforces'].push({
		"x": json[i].ratingUpdateTimeSeconds,
		"y": json[i].newRating
	    });
	}
    }

    if(history['atcoder']){
	var json = history['atcoder'];
	line['atcoder'] = [];
	for(i = 0; i < json.length; i++){
	    if(!json[i]['IsRated']) continue;
	    var tmp = json[i]['EndTime'].replace(/\./g,"/");
            line['atcoder'].push({
		"x": new Date(tmp).getTime() / 1000,
		"y": json[i]['NewRating'] / 1.0
	    });
	}
    }

    var minx, maxx;
    for (cite in line)
	if(line[cite].length > 0)
	    minx = maxx = line[cite][0].x;

    for (cite in line){
	for (point of line[cite]){
	    if(minx > point.x) minx = point.x;
	    if(maxx < point.x) maxx = point.x;
	}
    }

    var w = 400, h = 300;
    var svg = d3.select("#graphs")
	.append("svg")
	.attr("id", "svg1")
	.attr("width", w)
	.attr("height", h);

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");

    function drawGraph(list, color){
	if(list.length < 2) return;

	list.sort(function(a, b){
	    return a.x - b.x;
	});

	var miny, maxy;
	miny = maxy = list[0].y;
	for(point of list){
	    if(miny > point.y) miny = point.y;
	    if(maxy < point.y) maxy = point.y;
	}

	var line = d3.svg.line()
	    .x(function(d){return w * (d.x - minx) / (maxx - minx);})
	    .y(function(d){return h * (1.0 - (d.y - miny) / (maxy - miny));});

	svg.append("path")
	    .attr("d",line(list))
	    .attr("stroke",color)
	    .attr("stroke-width",1)
	    .attr("fill","none");
    }

    var colors = new Map();
    colors['topcoder']   = 'red';
    colors['codeforces'] = 'blue';
    colors['atcoder']    = 'green';

    for (cite in line)
	drawGraph(line[cite], colors[cite]);

    line = new Map();

    var source = (new XMLSerializer()).serializeToString(d3.select('#svg1').node());
    var canvas = $('<canvas>').get(0);
    canvg(canvas, source);
    var png = canvas.toDataURL();
    $("#image")
        .attr("download", "graph.png")
        .attr("href", png);
}

function getSolvedUrl(cite, handle){
    if(cite == "topcoder")
	return "https://api.topcoder.com/v2/users/"
        + handle
        + "/statistics/data/srm";

    if(cite == "codeforces")
	return "https://codeforces.com/api/user.status?handle=" + handle;

    if(cite == "atcoder")
	return "https://kenkoooo.com/atcoder/atcoder-api/v2/user_info?user="
        + handle;

    if(cite == "aoj")
	return "https://judgeapi.u-aizu.ac.jp/users/" + handle;

    if(cite == "yukicoder")
	return "https://yukicoder.me/api/v1/user/name/" + encodeURIComponent(handle);
}

function unwrap(data, cite){
    if(cite == "topcoder"){
	var res = 0;
	var div1 = data["Divisions"]["Division I" ]["Level Total"];
	var div2 = data["Divisions"]["Division II"]["Level Total"];
	res += div1["submitted"];
	res -= div1["failedChallenge"];
	res -= div1["failedSys.Test"];
	res += div2["submitted"];
	res -= div2["failedChallenge"];
	res -= div2["failedSys.Test"];
	return res;
    }

    if(cite == "codeforces"){
	if(data.result == null)
            return 0;

	var json = data.result;
	var problems = {};
	var res = 0;
	for(var i = 0; i < json.length; i++){
	    if(json[i].verdict != "OK" ||
	       json[i].testset != "TESTS" )  continue;

	    var prob = json[i].problem;
	    if(problems[prob.contestId] != undefined){
		if(problems[prob.contestId][prob.name] == undefined){
		    problems[prob.contestId][prob.name] = 1;
		    res += 1;
		}
	    }else{
		problems[prob.contestId] = {};
		problems[prob.contestId][prob.name] = 1;
		res += 1;
	    }
	}
	return res;
    }

    if(cite == "atcoder")
	return data.accepted_count;

    if(cite == "aoj")
	return data.status.solved;

    if(cite == "yukicoder")
	return data.Solved;
}

function ushitapnichiakun(retry){
    var cite = "librarychecker";
    var handle = getHandle(cite);
    if(retry < 0){
	alert("Failed: " + cite);
	solved[cite] = 0;
	num++;
	drawTable();
    }
    if(libraryCheckerResult){
	solved[cite] = 0;
	for (entry of libraryCheckerResult)
	    if(entry["array"][0] == handle)
		solved[cite] = entry["array"][1];
	num++;
	drawTable();
	return;
    }
    setTimeout(ushitapnichiakun, retry - 1, 1000);
}

function getSolved(cite){
    var handle = getHandle(cite);
    if(handle == ""){
	solved[cite] = 0;
	num++;
	drawTable();
	return;
    }

    if(cite == "librarychecker"){
	ushitapnichiakun(10);
	return;
    }

    var url = getSolvedUrl(cite, handle);
    getJson(url).done(function(data){
	solved[cite] = unwrap(data, cite);
    }).fail(function(data){
        alert("Failed: " + cite);
	solved[cite] = 0;
    }).always(function(data){
	num++;
	drawTable();
    });
}

function drawTable(){
    if(num < onlinejudge.length) return;

    show = [];
    solved['sum'] = 0;
    for (cite of onlinejudge){
	show.push(cite);
	solved[cite] *= 1.0;
	solved['sum'] += solved[cite];
    }
    show.push('sum');

    function display(cite){
	if(cite == 'topcoder') return "Topcoder";
	if(cite == 'codeforces') return "CodeForces";
	if(cite == 'atcoder') return "AtCoder";
	if(cite == 'aoj') return "AOJ";
	if(cite == 'yukicoder') return "yukicoder";
	if(cite == 'librarychecker') return "library-checker";
	if(cite == 'sum') return "Sum";
    }

    var table = "Solved: " + "<table border=\"1px\">";
    for (cite of show){
	table += "<tr><td>" + display(cite) + "</td>"
	table += "<td align=\"right\">" + solved[cite] + "</td></tr>";
    }
    table += "</tr></table>";
    document.getElementById("solved").innerHTML = table;

    var handle = document.getElementById("select_handle").value;
    var tweet = "Solved By " + handle + "\n";
    for (cite of show)
	tweet += display(cite) + ": " + solved[cite] + "\n";

    $.fn.appendTweetButton = function(url, text){
        $(this).append($("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\""+url+"\" data-text=\""+text+"\" data-count=\"vertical\">Tweet<\/a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');<\/script>"));
    }
    //Tweetボタンの設置
    $("#tweet").appendTweetButton($(location).attr('href'), tweet);
}

function getData(){
    d3.select("#graphs").selectAll("svg").remove();
    history = new Map();
    line = new Map();
    cnt = 0;

    for (cite of rated)
	getHistory(cite);

    solved = new Map();
    num = 0;
    for (cite of onlinejudge)
	getSolved(cite);
}

function updateSelecter(){
    $('#select_handle > option').remove();
    onlinejudge.forEach(function(v){
        s = document.getElementById("handle_" + v).value;
        if(s != "" && $("#select_handle option[value='"+s+"']").length == 0)
            $('#select_handle').append($('<option>')
                                       .html(s)
                                       .val(s));
    });
}

$(document).ready(function(){
    var result = {};
    if(1 < window.location.search.length) {
        var query = window.location.search.substring(1);
        var parameters = query.split('&');
        for(var i = 0; i < parameters.length; i++) {
            var element = parameters[i].split('=');
            var paramName  = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);
            result[paramName] = paramValue;
        }
    }

    for(cite of onlinejudge)
	if(result["handle_" + cite])
	    document.wrapper["handle_" + cite].value   = result["handle_" + cite];

    updateSelecter();
    onlinejudge.forEach(function(v){
        $("#" + v).change(function(){
            updateSelecter();
        });
    });

    if(result["select_handle"])
	$('#select_handle').val(result["select_handle"]);

    getData();
});
