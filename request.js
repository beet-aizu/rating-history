var history_topcoder;
var history_codeforces;
var history_atcoder;
var list_topcoder = [];
var list_codeforces = [];
var list_atcoder = [];
var flag_topcoder;
var flag_codeforces;
var flag_atcoder;
function getData(){
    flag_topcoder = false;
    flag_codeforces = false;
    flag_atcoder = false;
    getTopCoder();
    getCodeForces();
    getAtCoder();
}
function getTopCoder(){
    var handle = document.getElementById("handle_topcoder").value;
    //if(handle == "") handle = "beet";
    var url = "http://api.topcoder.com/v2/users/" + handle + "/statistics/data/srm";
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
	if (request.readyState != 4) {
            // リクエスト中
	} else if (request.status != 200) {
            alert("Failed(TC)");
	} else {
            // 取得成功
            var result = request.responseText;
	    history_topcoder = JSON.parse(result);
	    flag_topcoder = true;
	    drawGraphs();
	}
    };
    request.send(null);
}
function getCodeForces(){
    var handle = document.getElementById("handle_codeforces").value;
    //if(handle == "") handle = "beet";
    var url = "http://codeforces.com/api/user.rating?handle=" + handle;
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
	if (request.readyState != 4) {
            // リクエスト中
	} else if (request.status != 200) {
	    alert("Failed(CF)");
	} else {
            // 取得成功
            var result = request.responseText;
	    history_codeforces = JSON.parse(result);
	    flag_codeforces = true;
	    drawGraphs();
	}
    };
    request.send(null);
}

function getAtCoder(){
    var handle = document.getElementById("handle_atcoder").value;
    //if(handle == "") handle = "beet";
    $.ajax({
	type: 'GET',
	url: "https://atcoder.jp/user/" + handle,
	dataType: 'html',
	success: function(data) {
	    var src = data.responseText;
	    var jsonStr = getAtcoderJSON(src);
	    history_atcoder = JSON.parse(jsonStr);
	    flag_atcoder = true;
	    drawGraphs();
	}, error:function(e) {
	    alert("Failed(AC)");
	    console.log(e);
	}
    });
}

function getAtcoderJSON(src) {
    var idxf = src.indexOf('JSON.parse("');
    var idxe = src.indexOf('");]]>', idxf);
    if (idxf != -1 && idxe != -1) {
	return src.slice(idxf + 12, idxe).replace(/\\/g, "");
    }
    return null;
}

    
var w = 400;
var h = 300;
var minx,maxx,miny,maxy;

function drawGraphs(){
    if(!flag_topcoder || !flag_codeforces || !flag_atcoder) return;
    if(!true){
	alert(history_topcoder);
	alert(history_codeforces);
	alert(history_atcoder);
    }
    for(i = 0; i < history_topcoder.History.length; i++){
	list_topcoder.push({
	    "x": new Date(history_topcoder.History[i].date).getTime() / 1000,
	    "y": history_topcoder.History[i].rating
	});
    }
    for(i = 0; i < history_codeforces.result.length; i++){
	list_codeforces.push({
	    "x": history_codeforces.result[i].ratingUpdateTimeSeconds,
	    "y": history_codeforces.result[i].newRating
	});
    }
    for(i = 0; i < history_atcoder.length; i++){
	list_atcoder.push({
	    "x": history_atcoder[i][0],
	    "y": history_atcoder[i][1]
	});
    }
    if(!true){
	document.getElementById("rating_topcoder"  ).innerHTML = list_topcoder;
	document.getElementById("rating_codeforces").innerHTML = list_codeforces;
	document.getElementById("rating_atcoder"   ).innerHTML = list_atcoder;
    }

    minx = list_topcoder[0].x;
    maxx = list_topcoder[0].x;

    getRange(list_topcoder);
    getRange(list_codeforces);
    getRange(list_atcoder);

    if(!true){
	alert(minx);
	alert(maxx);
	alert(miny);
	alert(maxy);
    }
    
    var svg = d3.select("#graphs")
	.append("svg")
	.attr("width", w)
	.attr("height", h);
    
    drawGraph(list_topcoder  , svg, "red");
    drawGraph(list_codeforces, svg, "blue");
    drawGraph(list_atcoder   , svg, "green");
}

function getRange(list){
    list.sort(function(a,b){
	return a.x-b.x;
    });
    for(i = 0; i < list.length; i++){
	if(minx > list[i].x) minx = list[i].x;
	if(maxx < list[i].x) maxx = list[i].x;
    }
}

function drawGraph(list, svg, color){

    miny = list[0].y;
    maxy = list[0].y;
    for(i = 0; i < list.length; i++){
	if(miny > list[i].y) miny = list[i].y;
	if(maxy < list[i].y) maxy = list[i].y;
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
