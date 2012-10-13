
function showsettingsaccounts() {
 db_queries.push('select * from Bank_Account');
doTransactions(accsettingsquery);
}
var savesql;
function updateAccSettings(acc_num,acc_num_with) {

var theacc_name = $('input#'+acc_num+'accname').val();
var thebank =  $('input#'+acc_num+'bank').val();

savesql = 'update Bank_Account set Acc_Name=\''+theacc_name+'\',Bank=\''+thebank+'\' WHERE Account_Num=\''+acc_num_with+'\'';

db.transaction(updateAccSettingsquery, function() { alert('error during update'); }, sqlaccupdatesuccess);
}

function updateAccSettingsquery(tx) {
tx.executeSql(savesql);
}

function deleteAccSettings(acc_num) {
savesql = 'delete from Bank_Account where Account_Num=\''+acc_num+'\'';
db.transaction(deleteAccSettingsquery, function() { alert('error during delete'); }, sqlaccdeletesuccess);
}
function deleteAccSettingsquery(tx) {
tx.executeSql(savesql);
}
function sqlaccdeletesuccess() {
alert('Account deleted successfully.');
showsettingsaccounts();
}

function removeSpaces(s) {
	var ret = '';
	for (var k=0; k<s.length;k++) {
	var ch = s.charAt(k);
	if (ch!=' ' && ch!='.') {
	//if ((ch>65 && ch<90) || (ch>97 && ch<122)) {
	ret+=ch;
	}
	}
	return ret;
}
//show account and let them be edited
function accsettingsquery() {
var str ='';//$('ul#settingsAccountscontent').html();

	var rows = db_results.shift().rows;
	var len = rows.length;
	//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add an Account</li><li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div data-role="fieldcontain"><label  for="bank">Bank</label>	<input   id="bank"  value="" type="text">	</div><div data-role="fieldcontain">	<label for="acc_name">Account Name</label>	<input id="acc_name"  value="" type="text">	</div>	<input data-inline="true" align="middle" class="update" value="Update" type="submit"><br />	</li>';
	for (var k=0; k<len; k++) {
		var acc_num = rows.item(k).Account_Num;
		var acc_num_no_spaces = removeSpaces(acc_num);
		

		//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add an Account</li><li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div data-role="fieldcontain"><label  for="bank">Bank</label>	<input   id="bank"  value="" type="text">	</div><div data-role="fieldcontain">	<label for="acc_name">Account Name</label>	<input id="acc_name"  value="" type="text">	</div>	<input data-inline="true" align="middle" class="update" value="Update" type="submit"><br />	</li>';
		
		str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">'+acc_num+'</li>';
		str +='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div class="ui-btn-inner ui-li">';
		str+='<div data-role="fieldcontain"><label  for="'+acc_num_no_spaces+'bank">Bank</label><input  id="'+acc_num_no_spaces+'bank"  value="'+rows.item(k).Bank+'" type="text"></div>';
		str+='<div data-role="fieldcontain"><label  for="'+acc_num_no_spaces+'accname">Account Name</label><input  id="'+acc_num_no_spaces+'accname"  value="'+rows.item(k).Acc_Name+'" type="text"></div>';
		//str +='<a href="javascript:updateAccSettings('+acc_num_no_spaces+');" >Update</a><br /></li>';
		
		
		str+='<input onclick="updateAccSettings(\''+acc_num_no_spaces+'\',\''+acc_num+'\');" data-inline="true" align="middle"  value="Update" type="submit"><input onclick="deleteAccSettings(\''+acc_num+'\');" data-inline="true" align="middle"  value="Delete" type="submit"><br /></div></li>';
		//align="middle" class="update" value="Update" type="submit"
	}
	
	
	$('ul#settingsAccountscontent').html(str);
	console.log('success settings account');
	
	
}


function sqlaccupdatesuccess() {
alert("Account changed successfully!");
console.log('account updated successfully');
}

