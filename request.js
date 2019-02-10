var history_topcoder;
var history_codeforces;
var history_atcoder;
var list_topcoder = [];
var list_codeforces = [];
var list_atcoder = [];
var flag_topcoder;
var flag_codeforces;
var flag_atcoder;
var solved_topcoder;
var solved_codeforces;
var solved_atcoder;
var solved_aoj;
var solved_yukicoder;
var solved_sum;

// risky
var tmp;

function getData(){
    d3.select("#graphs").selectAll("svg").remove();
    history_topcoder = undefined;
    history_codeforces = undefined;
    history_atcoder = undefined;
    list_topcoder = [];
    list_codeforces = [];
    list_atcoder = [];
    flag_topcoder = false;
    flag_codeforces = false;
    flag_atcoder = false;
    getTopCoder();
    getCodeForces();
    getAtCoder();
    getSolved();
}

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

function getTopCoder(){
    var handle = document.getElementById("handle_topcoder").value;
    if(handle == ""){
	      flag_topcoder = true;
	      drawGraphs();
	      return;
    }
    var url =
        "https://api.topcoder.com/v2/users/"
        + handle
        + "/statistics/data/srm";
    getJson(url).done(function(data){
	      history_topcoder = data;
	  }).fail(function(data){
	      alert("Failed(TC)");
	  }).always(function(data){        
        flag_topcoder = true;
        drawGraphs();
    });    
}

function getCodeForces(){
    var handle = document.getElementById("handle_codeforces").value;
    if(handle == ""){
	      flag_codeforces = true;
	      drawGraphs();
	      return;
    }
    var url = "https://codeforces.com/api/user.rating?handle=" + handle;    
    getJson(url).done(function(data){
	      history_codeforces = data;
	  }).fail(function(data){
	      alert("Failed(CF)");
	  }).always(function(data){        
        flag_codeforces = true;
        drawGraphs();
    });   
}

function getAtCoder(){
    var handle = document.getElementById("handle_atcoder").value;
    if(handle == ""){
	      flag_atcoder = true;
	      drawGraphs();
	      return;
    }
	  var url =
        "ajax.php?url=https://atcoder.jp/users/"
        + handle
        + "/history/json";
	  getJson(url).done(function(data){
	      history_atcoder = data;
	  }).fail(function(data){
	      alert("Failed(AC)");
	  }).always(function(data){        
        flag_atcoder = true;
        drawGraphs();
    });  
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
    var json;
    if(history_topcoder != undefined)
	      json = history_topcoder.History;
    else json = undefined;
    for(i = 0; json != undefined && i < json.length; i++){
	      var tmp = json[i].date.replace(/\./g,"/");
	      list_topcoder.push({
	          "x": new Date(tmp).getTime() / 1000,
	          "y": json[i].rating
	      });
    }
    
    if(history_codeforces != undefined)
	      json = history_codeforces.result;
    else json = undefined;
    for(i = 0; json != undefined && i < json.length; i++){
	      list_codeforces.push({
	          "x": json[i].ratingUpdateTimeSeconds,
	          "y": json[i].newRating
	      });
    }
    
    if(history_atcoder != undefined)
	      json = history_atcoder;
    else json = undefined;
    for(i = 0; json != undefined && i < json.length; i++){
	      if(!json[i]['IsRated']) continue;
	      var tmp = json[i]['EndTime'].replace(/\./g,"/");
        list_atcoder.push({
	          "x": new Date(tmp).getTime() / 1000,
	          "y": json[i]['NewRating'] / 1.0
	      });
    }
    
    if(!true){
	      document.getElementById("rating_topcoder"  ).innerHTML = list_topcoder;
	      document.getElementById("rating_codeforces").innerHTML = list_codeforces;
	      document.getElementById("rating_atcoder"   ).innerHTML = list_atcoder;
    }    
    
    if(list_topcoder.length != 0){
	      minx = list_topcoder[0].x;
	      maxx = list_topcoder[0].x;
    }else if(list_codeforces.length != 0){
	      minx = list_codeforces[0].x;
	      maxx = list_codeforces[0].x;
    }else if(list_atcoder.length != 0){
	      minx = list_atcoder[0].x;
	      maxx = list_atcoder[0].x;
    }else{
	      return;
    }

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
    
    list_topcoder = [];
    list_codeforces = [];
    list_atcoder = [];

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
    if(list == undefined || list == null || list.length < 2) return;
    
    
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

function getSolved(){
    solved_topcoder   = -1;
    solved_codeforces = -1;
    solved_atcoder    = -1;
    solved_aoj        = -1;
    solved_yukicoder  = -1;
    getSolvedTC();
    getSolvedCF();
    getSolvedAC();
    getSolvedAOJ();
    getSolvedYC();
    drawTable();
}

function getSolvedTC(){
    var handle = document.getElementById("handle_topcoder").value;
    if(handle == ""){
	      solved_topcoder = 0;
	      drawTable();
	      return;
    }
    var url =
        "https://api.topcoder.com/v2/users/"
        + handle
        + "/statistics/data/srm";
    getJson(url).done(function(data){
	      solved_topcoder = 0;
	      var div1 = data["Divisions"]["Division I" ]["Level Total"];
	      var div2 = data["Divisions"]["Division II"]["Level Total"];
	      solved_topcoder += div1["submitted"];
	      solved_topcoder -= div1["failedChallenge"];
	      solved_topcoder -= div1["failedSys.Test"];
	      solved_topcoder += div2["submitted"];
	      solved_topcoder -= div2["failedChallenge"];
	      solved_topcoder -= div2["failedSys.Test"];
	  }).fail(function(data){
	      alert("Failed(TC)");
	      solved_topcoder = 0;
	  }).always(function(data){        
	      drawTable();
    });
}

function getSolvedCF(){
    var handle = document.getElementById("handle_codeforces").value;
    if(handle == ""){
	      solved_codeforces = 0;
	      drawTable();
	      return;
    }
    var url = "https://codeforces.com/api/user.status?handle=" + handle;    
    getJson(url).done(function(data){
	      if(data.result==null){
		        solved_codeforces = 0;
		        drawTable();
            return;
	      }
	      var json = data.result;
	      var problems = {};
	      solved_codeforces = 0;
	      for(var i = 0; i < json.length; i++){
		        if(json[i].verdict != "OK" ||
		           json[i].testset != "TESTS" )  continue;
		        
		        var prob = json[i].problem;
		        if(problems[prob.contestId] != undefined){
		            if(problems[prob.contestId][prob.name] == undefined){
			              problems[prob.contestId][prob.name] = 1;
			              solved_codeforces += 1;
		            }
		        }else{
		            problems[prob.contestId] = {};
		            problems[prob.contestId][prob.name] = 1;
		            solved_codeforces += 1;
		        }
	      }
	  }).fail(function(data){
        alert("Failed(CF)");
	      solved_codeforces = 0;
	  }).always(function(data){        
	      drawTable();
    });
}
function getSolvedAC(){
    var handle = document.getElementById("handle_atcoder").value;
    if(handle == ""){
	      solved_atcoder = 0;
	      drawTable();
	      return;
    }
    var url =
        "https://kenkoooo.com/atcoder/atcoder-api/v2/user_info?user="
        + handle;
    getJson(url).done(function(data){   
        solved_atcoder = data.accepted_count;
	  }).fail(function(data){
		    alert("Failed(AC)");
	      solved_atcoder = 0;
	  }).always(function(data){        
	      drawTable();
    });
}
function getSolvedAOJ(){
    var handle = document.getElementById("handle_aoj").value;
    if(handle == ""){
	      solved_aoj = 0;
	      drawTable();
	      return;
    }
    var url = "https://judgeapi.u-aizu.ac.jp/users/" + handle;
    getJson(url).done(function(data){
	      solved_aoj = data.status.solved;
	  }).fail(function(data){
		    alert("Failed(AOJ)");
	      solved_aoj = 0;
	  }).always(function(data){        
	      drawTable();
    });
}

function getSolvedYC(){
    var handle = document.getElementById("handle_yukicoder").value;
    if(handle == ""){
	      solved_yukicoder = 0;
	      drawTable();
	      return;
    }
    var url =
        "https://yukicoder.me/api/v1/user/name/"
        + encodeURIComponent(handle);
    getJson(url).done(function(data){
	      solved_yukicoder = data.Solved;
	  }).fail(function(data){        
        alert("Failed(YC)");
	      solved_yukicoder = 0;
	  }).always(function(data){        
	      drawTable();
    });
}


function drawTable(){
    if(solved_topcoder   < 0 ||
       solved_codeforces < 0 ||
       solved_atcoder    < 0 ||
       solved_yukicoder  < 0 ||
       solved_aoj        < 0 ) return;

    if(solved_topcoder   == undefined ||
       solved_topcoder   == null) solved_topcoder = 0;
    if(solved_codeforces == undefined ||
       solved_codeforces == null) solved_codeforces = 0;
    if(solved_atcoder    == undefined ||
       solved_atcoder    == null) solved_atcoder = 0;
    if(solved_aoj        == undefined ||
       solved_aoj        == null) solved_aoj = 0;
    if(solved_yukicoder  == undefined ||
       solved_yukicoder  == null) solved_yukicoder = 0;
    
    solved_topcoder *= 1.0;
    solved_codeforces *= 1.0;
    solved_atcoder *= 1.0;
    solved_aoj *= 1.0;
    solved_yukicoder *= 1.0;
    
    solved_sum = 0;
    solved_sum += solved_topcoder;
    solved_sum += solved_codeforces;
    solved_sum += solved_atcoder;
    solved_sum += solved_yukicoder;
    solved_sum += solved_aoj;
    
    document.getElementById("solved").innerHTML =
	      "Solved: "
	      +"<table border=\"1px\">"
	      +"<tr>"
	      +"<td>" + "TopCoder"        + "</td>"
	      +"<td align=\"right\">" + solved_topcoder   + "</td>"
	      +"</tr>"
	      +"<tr>"
	      +"<td>" + "CodeForces"      + "</td>"
	      +"<td align=\"right\">" + solved_codeforces + "</td>"
	      +"</tr>"
	      +"<tr>"
	      +"<td>" + "AtCoder"         + "</td>"
	      +"<td align=\"right\">" + solved_atcoder    + "</td>"
	      +"</tr>"
	      +"<tr>"
	      +"<td>" + "AOJ"             + "</td>"
	      +"<td align=\"right\">" + solved_aoj        + "</td>"
	      +"</tr>"
	      +"<tr>"
	      +"<td>" + "yukicoder"       + "</td>"
	      +"<td align=\"right\">" + solved_yukicoder  + "</td>"
	      +"</tr>"
	      +"<tr>"
	      +"<td>" + "Sum"             + "</td>"
	      +"<td align=\"right\">" + solved_sum        + "</td>"
	      +"</tr>"
	      +"</table>";
    var tweet = "";
    var handle = document.getElementById("handle_topcoder").value;
    if(handle == "") handle = document.getElementById("handle_codeforces").value;
    if(handle == "") handle = document.getElementById("handle_atcoder").value;
    if(handle == "") handle = document.getElementById("handle_aoj").value;
    if(handle == "") handle = document.getElementById("handle_yukicoder").value;
    tweet += "Solved By " + handle + "\n";
    tweet += "TopCoder: " + solved_topcoder + "\n";
    tweet += "CodeForces: " + solved_codeforces + "\n";
    tweet += "AtCoder: " + solved_atcoder + "\n";
    tweet += "AOJ: " + solved_aoj + "\n";
    tweet += "yukicoder: " + solved_yukicoder + "\n";
    tweet += "Sum: " + solved_sum + "\n";
    $.fn.appendTweetButton = function(url, text){
        $(this).append($("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\""+url+"\" data-text=\""+text+"\" data-count=\"vertical\">Tweet<\/a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');<\/script>"));
    }
    //Tweetボタンの設置
    $("body").appendTweetButton($(location).attr('href'), tweet);
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
    if(result["handle_topcoder"])
	      document.wrapper.handle_topcoder.value   = result["handle_topcoder"];
    if(result["handle_codeforces"])
	      document.wrapper.handle_codeforces.value = result["handle_codeforces"];
    if(result["handle_atcoder"])
	      document.wrapper.handle_atcoder.value    = result["handle_atcoder"];
    if(result["handle_aoj"])
	      document.wrapper.handle_aoj.value        = result["handle_aoj"];
    if(result["handle_yukicoder"])
	      document.wrapper.handle_yukicoder.value  = result["handle_yukicoder"];
    
    solved_topcoder   = -1;
    solved_codeforces = -1;
    solved_atcoder    = -1;
    solved_aoj        = -1;
    solved_yukicoder  = -1;
    
    getData();
});
