function construct(){
    var input = $('#input').val();
    //alert(input);
    input = input.replace(/</g,"うぃーん");
    input = input.replace(/>/g,"ﾋﾞｰﾄﾋﾞｰﾄ");
    input = input.replace(/\+/g,"ひるど");
    input = input.replace(/\-/g,"うっくっく");
    input = input.replace(/\[/g,"えいえいえt");
    input = input.replace(/\]/g,"(←いずらいt)");
    input = input.replace(/\./g,"らて。");
    var output = input;
    document.getElementById('output').value = output;
}
function exec(){
    var input = $('#input').val();
    //alert(input);
    input = input.replace(/うぃーん/g,"<");
    input = input.replace(/ﾋﾞｰﾄﾋﾞｰﾄ/g,">");
    input = input.replace(/ひるど/g,"+");
    input = input.replace(/うっくっく/g,"-");
    input = input.replace(/えいえいえt/g,"[");
    input = input.replace(/\(←いずらいt\)/g,"]");
    input = input.replace(/らて。/g,".");
    //alert(input);
    var output = "";
    var ptr = 0;
    var mem = [];
    for(var i = 0; i < 1000; i++) mem[i] = 0;
    var jump = [];
    var st = [];
    for(var i in input){
	var c = input[i];
	if(c=='['){
	    st.push(i);
	}
	if(c==']'){
	    var k = st.pop();
	    //console.log(i+":"+k);
	    jump[k] = i;
	    jump[i] = k;
	}
    }
    for(var i = 0; i < input.length; i++){
	var c = input[i];
	//console.log("idx:"+i+";cmd:"+c+";ptr:"+ptr+";mem:"+mem[ptr]);
	if(c=='>') ptr++;
	if(c=='<') ptr--;
	if(c=='+') mem[ptr]++;
	if(c=='-') mem[ptr]--;
	if(c=='['){
	    if(mem[ptr]==0) i = jump[i] + 1;
	}
	if(c==']'){
	    if(mem[ptr]!=0) i = jump[i];
	}
	if(c=='.') output += String.fromCharCode(mem[ptr]);
    }
    document.getElementById('output').value = output;
}
