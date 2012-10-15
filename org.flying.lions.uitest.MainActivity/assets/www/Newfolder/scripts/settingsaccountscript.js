
function showsettingsaccounts() {
 db_queries.push('select * from Bank_Account');
doTransactions(accsettingsquery);
}
var savesql;
function updateAccSettings(acc_num,acc_num_with) {

var theacc_name = $('input#'+acc_num+'accname').val();
var thebank =  $('input#'+acc_num+'bank').val();

savesql = 'update Bank_Account set Acc_Name=\''+theacc_name+'\',Bank=\''+thebank+'\' WHERE Account_Num=\''+acc_num_with+'\'';

db.transaction(updateAccSettingsquery, function() { if (debug_mode) alert('error during update'); }, sqlaccupdatesuccess);
}

function updateAccSettingsquery(tx) {
tx.executeSql(savesql);
}

function deleteAccSettings(acc_num) {
savesql = 'delete from Bank_Account where Account_Num=\''+acc_num+'\'';
db.transaction(deleteAccSettingsquery, function() { if (debug_mode) alert('error during delete'); }, sqlaccdeletesuccess);
}
function deleteAccSettingsquery(tx) {
tx.executeSql(savesql);
}
function sqlaccdeletesuccess() {
alert('Account deleted successfully.');
showsettingsaccounts();
db_queries.push('select * from Bank_Account');
doTransactions(getprev);
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
	if (len==0)
	str= '<h3>No accounts yet</h3>';
	//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add an Account</li><li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div data-role="fieldcontain"><label  for="bank">Bank</label>	<input   id="bank"  value="" type="text">	</div><div data-role="fieldcontain">	<label for="acc_name">Account Name</label>	<input id="acc_name"  value="" type="text">	</div>	<input data-inline="true" align="middle" class="update" value="Update" type="submit"><br />	</li>';
	for (var k=0; k<len; k++) {
		var acc_num = rows.item(k).Account_Num;
		var acc_num_no_spaces = removeSpaces(acc_num);
		

		//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add an Account</li><li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div data-role="fieldcontain"><label  for="bank">Bank</label>	<input   id="bank"  value="" type="text">	</div><div data-role="fieldcontain">	<label for="acc_name">Account Name</label>	<input id="acc_name"  value="" type="text">	</div>	<input data-inline="true" align="middle" class="update" value="Update" type="submit"><br />	</li>';
		
		str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">'+acc_num+'</li>';
		str+='<li data-role="fieldcontain"> <label  for="'+acc_num_no_spaces+'bank">Bank</label>   <input type="text"  id="'+acc_num_no_spaces+'bank"  name="'+acc_num_no_spaces+'bank"  value="'+rows.item(k).Bank+'" /></li>';
		str+='<li data-role="fieldcontain"><label  for="'+acc_num_no_spaces+'accname">Account Name</label>   <input type="text"  id="'+acc_num_no_spaces+'accname" name="'+acc_num_no_spaces+'accname"  value="'+rows.item(k).Acc_Name+'"  /></li>';
		/*str +='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div class="ui-btn-inner ui-li">';
		str+='<div data-role="fieldcontain"><label  for="'+acc_num_no_spaces+'bank">Bank</label><input  id="'+acc_num_no_spaces+'bank"  value="'+rows.item(k).Bank+'" type="text"></div>';
		str+='<div data-role="fieldcontain"><label  for="'+acc_num_no_spaces+'accname">Account Name</label><input  id="'+acc_num_no_spaces+'accname"  value="'+rows.item(k).Acc_Name+'" type="text"></div>';*/
		//str +='<a href="javascript:updateAccSettings('+acc_num_no_spaces+');" >Update</a><br /></li>';
		str+='<li class="ui-body ui-body-b"><fieldset class="ui-grid-a"><div class="ui-block-a"><button data-theme="a" onclick="updateAccSettings(\''+acc_num_no_spaces+'\',\''+acc_num+'\');" >Update</button></div>';
str+= '<div class="ui-block-b"><button data-theme="a" onclick="deleteAccSettings(\''+acc_num+'\');" >Delete</button></div>		</fieldset>		</li>';
		
		//str+='<input onclick="updateAccSettings(\''+acc_num_no_spaces+'\',\''+acc_num+'\');" data-inline="true" align="middle"  value="Update" type="submit"><input onclick="deleteAccSettings(\''+acc_num+'\');" data-inline="true" align="middle"  value="Delete" type="submit"><br /></div></li>';
		//align="middle" class="update" value="Update" type="submit"
	}
	
	
	$('ul#settingsAccountscontent').html(str);
	$('ul#settingsAccountscontent').listview('refresh');
	$('ul#settingsAccountscontent').trigger('create');
	
	console.log('success settings account');
	
	
}


function sqlaccupdatesuccess() {
alert("Account changed successfully!");
console.log('account updated successfully');
}

