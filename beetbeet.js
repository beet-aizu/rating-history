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
    input = input.replace(/(←いずらいt)/g,"]");
    input = input.replace(/らて。/g,".");
    
    var output = input;
    document.getElementById('output').value = output;
}
