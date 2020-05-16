class topcoder{
    constructor(){
	this.data = undefined;
	this.solved = 0;
    }
    get name(){
	return "topcoder";
    }
    get displayName(){
	return "Topcoder";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return true;
    }
    get historyUrl(){
	return "https://api.topcoder.com/v2/users/"
            + this.handle
            + "/statistics/data/srm";
    }
    setData(data){
	this.data = data;
    }
    get line(){
	var json = this.data.History;
	var line = [];
	for(var i = 0; i < json.length; i++){
	    var tmp = json[i].date.replace(/\./g,"/");
	    line.push({
		"x": new Date(tmp).getTime() / 1000,
		"y": json[i].rating
	    });
	}
	return line;
    }
    get color(){
	return "red";
    }
    get solvedUrl(){
	return "https://api.topcoder.com/v2/users/"
        + this.handle
        + "/statistics/data/srm";
    }
    unwrap(data){
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
}

class codeforces{
    constructor(){
	this.data = undefined;
	this.solved = 0;
    }
    get name(){
	return "codeforces";
    }
    get displayName(){
	return "Codeforces";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return true;
    }
    get historyUrl(){
	return "https://codeforces.com/api/user.rating?handle=" + this.handle;
    }
    setData(data){
	this.data = data;
    }
    get line(){
	var json = this.data.result;
	var line = [];
	for(var i = 0; i < json.length; i++){
	    line.push({
		"x": json[i].ratingUpdateTimeSeconds,
		"y": json[i].newRating
	    });
	}
	return line;
    }
    get color(){
	return "blue";
    }
    get solvedUrl(){
	return "https://codeforces.com/api/user.status?handle=" + this.handle;
    }
    unwrap(data){
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
}

class atcoder{
    constructor(){
	this.data = undefined;
	this.solved = 0;
    }
    get name(){
	return "atcoder";
    }
    get displayName(){
	return "AtCoder";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return true;
    }
    get historyUrl(){
	return "ajax.php?url=https://atcoder.jp/users/"
        + this.handle
        + "/history/json";
    }
    setData(data){
	this.data = data;
    }
    get line(){
	var json = this.data;
	var line = [];
	for(var i = 0; i < json.length; i++){
	    if(!json[i]['IsRated']) continue;
	    var tmp = json[i]['EndTime'].replace(/\./g,"/");
            line.push({
		"x": new Date(tmp).getTime() / 1000,
		"y": json[i]['NewRating'] / 1.0
	    });
	}
	return line;
    }
    get color(){
	return "green";
    }
    get solvedUrl(){
	return "https://kenkoooo.com/atcoder/atcoder-api/v2/user_info?user="
            + this.handle;
    }
    unwrap(data){
	return data.accepted_count;
    }
}


class aoj{
    constructor(){
	this.solved = 0;
    }
    get name(){
	return "aoj";
    }
    get displayName(){
	return "AOJ";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return false;
    }
    get solvedUrl(){
	return "https://judgeapi.u-aizu.ac.jp/users/" + this.handle;
    }
    unwrap(data){
	return data.status.solved;
    }
}

class yukicoder{
    constructor(){
	this.solved = 0;
    }
    get name(){
	return "yukicoder";
    }
    get displayName(){
	return "yukicoder";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return false;
    }
    get solvedUrl(){
	return "https://yukicoder.me/api/v1/user/name/"
	    + encodeURIComponent(this.handle);
    }
    unwrap(data){
	return data.Solved;
    }
}

class librarychecker{
    constructor(){
	this.solved = 0;
    }
    get name(){
	return "librarychecker";
    }
    get displayName(){
	return "library-checker";
    }
    get handle(){
	return document.getElementById("handle_" + this.name).value;
    }
    get rated(){
	return false;
    }
}

var onlinejudge = [];
onlinejudge.push(new topcoder());
onlinejudge.push(new codeforces());
onlinejudge.push(new atcoder());
onlinejudge.push(new aoj());
onlinejudge.push(new yukicoder());
onlinejudge.push(new librarychecker());
var cnt, num;

function getJson(url){
    return $.ajax(
	{
	    type     : 'GET',
	    url      : url,
	    dataType : 'json',
	    timeout  : 20000,
	});
}

function getHistory(cite){
    if(cite.handle == ""){
	cnt--;
	drawGraphs();
	return;
    }
    getJson(cite.historyUrl).done(function(data){
	cite.setData(data);
    }).fail(function(data){
	alert("Failed " + cite.name);
    }).always(function(data){
        cnt--;
        drawGraphs();
    });
}

function drawGraphs(){
    if(cnt > 0) return;

    var minx, maxx;
    for (cite of onlinejudge){
	if(!cite.data) continue;
	if(cite.line.length > 0)
	    minx = maxx = cite.line[0].x;
    }

    for (cite of onlinejudge){
	if(!cite.data) continue;
	for (point of cite.line){
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

    for (cite of onlinejudge)
	if(cite.data) drawGraph(cite.line, cite.color);

    var source = (new XMLSerializer()).serializeToString(d3.select('#svg1').node());
    var canvas = $('<canvas>').get(0);
    canvg(canvas, source);
    var png = canvas.toDataURL();
    $("#image")
        .attr("download", "graph.png")
        .attr("href", png);
}

function ushitapnichiakun(retry){
    var cite;
    for (cand of onlinejudge)
	if (cand.name == "librarychecker")
	    cite = cand;

    if(retry < 0){
	alert("Failed: " + cite.name);
	cite.solved = 0;
	num--;
	drawTable();
    }

    var handle = cite.handle;
    if(libraryCheckerResult){
	solved[cite] = 0;
	for (entry of libraryCheckerResult)
	    if(entry["array"][0] == handle)
		cite.solved = entry["array"][1];
	num--;
	drawTable();
	return;
    }
    setTimeout(ushitapnichiakun, retry - 1, 1000);
}

function getSolved(cite){
    if(cite.handle == ""){
	num--;
	drawTable();
	return;
    }

    if(cite.name == "librarychecker"){
	ushitapnichiakun(10);
	return;
    }

    getJson(cite.solvedUrl).done(function(data){
	cite.solved = cite.unwrap(data);
    }).fail(function(data){
        alert("Failed: " + cite.name);
    }).always(function(data){
	num--;
	drawTable();
    });
}

function drawTable(){
    if(num > 0) return;

    var sum = 0;
    var table = "Solved: " + "<table border=\"1px\">";
    for (cite of onlinejudge){
	sum += cite.solved * 1.0;
	table += "<tr><td>" + cite.displayName + "</td>"
	table += "<td align=\"right\">" + cite.solved + "</td></tr>";
    }

    table += "<tr><td>Sum</td>"
    table += "<td align=\"right\">" + sum + "</td></tr>";

    table += "</tr></table>";

    document.getElementById("solved").innerHTML = table;

    var handle = document.getElementById("select_handle").value;
    var tweet = "Solved By " + handle + "\n";
    for (cite of onlinejudge)
	tweet += cite.displayName + ": " + cite.solved + "\n";
    tweet +=  "Sum: " + sum + "\n";

    $.fn.appendTweetButton = function(url, text){
        $(this).append($("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\""+url+"\" data-text=\""+text+"\" data-count=\"vertical\">Tweet<\/a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');<\/script>"));
    }
    //Tweetボタンの設置
    $("#tweet").appendTweetButton($(location).attr('href'), tweet);
}

function updateSelecter(){
    $('#select_handle > option').remove();
    onlinejudge.forEach(function(v){
        s = document.getElementById("handle_" + v.name).value;
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
	if(result["handle_" + cite.name])
	    document.wrapper["handle_" + cite.name].value = result["handle_" + cite.name];

    updateSelecter();
    onlinejudge.forEach(function(v){
        $("#" + v.name).change(function(){
            updateSelecter();
        });
    });

    if(result["select_handle"])
	$('#select_handle').val(result["select_handle"]);

    d3.select("#graphs").selectAll("svg").remove();

    cnt = 0;
    for (cite of onlinejudge)
	if(cite.rated) cnt += 1.0;

    for (cite of onlinejudge)
	if(cite.rated)
	    getHistory(cite);

    num = onlinejudge.length;
    for (cite of onlinejudge)
	getSolved(cite);
});
