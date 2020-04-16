function getJson(url){
    return $.ajax(
	{
	    type     : 'GET',
	    url      : url,
	    dataType : 'json',
	    timeout  : 20000,
	});
}

function AOJLink(v, judgeId){
    if (judgeId){
	url = "http://judge.u-aizu.ac.jp/onlinejudge/review.jsp?"
	    + "rid=" + judgeId;
    }else{
	url = "http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?"
	    + "id=" + v.id;
    }
    return $("<a href=\"" + url + "\">").text(v.id);
}

function AtCoderLink(v, judgeId){
    if (judgeId){
	url = "https://atcoder.jp"
	    + "/contests/" + v.contest_id
	    + "/submissions/" + judgeId;
    }else{
	url = "https://atcoder.jp"
	    + "/contests/" + v.contest_id
	    + "/tasks/" + v.problem_id;
    }
    return $("<a href=\"" + url + "\">").text(v.problem_id);
}

function updateAOJ(v){
    handle = document.wrapper.handle_aoj.value;
    url =
	"https://judgeapi.u-aizu.ac.jp/solutions"
	+ "/users/" + handle
	+ "/problems/" + v.id;

    getJson(url).done(function(data){
	if(data.length > 0){
	    elem = $("#aoj"+v.id);
	    elem.empty();
	    elem.append(AOJLink(v, data[0].judgeId));
	    elem.addClass("solved");
	}
    });
}

function atcoder(v){
    return v.contest_id + "_" + v.problem_id;
}

function updateAtCoder(){
    handle = document.wrapper.handle_atcoder.value;
    url = "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + handle;
    getJson(url).done(function(data){
	solved = new Map();
	data.forEach(function(v){
	    if(v.result == "AC")
		solved.set(atcoder(v), v.id);
	});
	list.forEach(function(v){
	    if (solved.has(atcoder(v))){
		elem = $("#" + atcoder(v));
		elem.empty();
		elem.append(AtCoderLink(v, solved.get(atcoder(v))));
		elem.addClass("solved");
	    }
	});
    });
}

function getData(){
    {
	row = $("<tr>");
	row.append($("<th>").text("AOJ"));
	row.append($("<th>").text("AtCoder"));
	$("#table").append(row);
    }
    list.forEach(function(v){
	row = $("<tr>");
	row.append($("<td id=\"aoj" + v.id + "\">").append(AOJLink(v)));
	row.append($("<td id=\"" + atcoder(v) + "\">").append(AtCoderLink(v)));
	$("#table").append(row);
	updateAOJ(v);
    });
    updateAtCoder();
}

function reflectForm(){
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

    if(result["handle_aoj"])
	document.wrapper.handle_aoj.value        = result["handle_aoj"];

    if(result["handle_atcoder"])
	document.wrapper.handle_atcoder.value    = result["handle_atcoder"];
}

$(document).ready(function(){
    reflectForm();

    getJson("./list.json").done(function(data){
	list = data.list;
	list.pop();
	getData();
    });

    $("#odd_only").change(function(){
	var prop = $('#odd_only').prop('checked');
	tr = $("table tr");
	for(i = 1 ; i < tr.length; i++){
	    a = false;
	    ch = tr.eq(i).children();

	    for (j = 0; j < ch.length; j++)
		if (ch.eq(j).hasClass("solved")) a = !a;

	    if(prop && !a) tr.eq(i).hide();
	    else tr.eq(i).show();
	}
    });
});
