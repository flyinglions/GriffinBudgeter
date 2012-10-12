//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">'+prevdate+'</li>';
var categorylist;
function retrievesettings() {

var transmax = INIget('settings','transmax');

$('input#transmax').val(transmax);
$('input#transmax').slider('refresh');
categorylist = INIgetsection('categories');
var str='<ul  data-role="listview" data-theme="d" data-divider-theme="d" class="ui-listview">';

//category header
str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Custom categories</li>';
//str+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">						<div class="ui-btn-inner ui-li"><div class="ui-btn-text">';
for (var k=0; k<categorylist.length; k++) {
var catname = categorylist[k].name;
if (catname=='undefined')
break;
var val = categorylist[k].val;
//str+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">'+'<a href="transactions.html" class="ui-link-inherit"><h3 class="ui-li-heading">'+val+'</h3><p class="ui-li-desc"><div data-role="fieldcontain">	<label style="white-space:normal" for="transmax">Maximum transactions to show</label><input type="range" name="transmax" id="transmax" value="'+transmax+'" min="0" max="100" data-highlight="true" />	</div>			</p><p class=" ui-li-aside ui-li-desc">		R333.00		</p></a>'+'</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
str += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d" data-role="fieldcontain"><label  for="'+catname+'">'+catname+'</label><input id="'+catname+'"  value="'+val+'" type="text"></li>';
//str += '<li  data-role="fieldcontain"><label  for="'+catname+'">'+catname+'</label><input id="'+catname+'"  value="'+val+'" type="text"></li>';
}
str+='</ul>';
//str+='<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></div></li>'
$('#catul').html(str);


}

function showgraphsettings() {
startINI(retrievesettings);
}

function updategraphsettings() {
var transmax = $('input#transmax').val();
INIset('settings','transmax',transmax);

for (var k=0; k<categorylist.length; k++)
INIset('categories',categorylist[k].name,$('input#'+categorylist[k].name).val());

stopINI();
alert("Updated!");
}