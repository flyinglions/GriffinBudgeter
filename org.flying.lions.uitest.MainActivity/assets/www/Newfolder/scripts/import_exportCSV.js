/*
 * Import CSV file of SMSes
 * 
 */

function importCSV(fileLoc){
	var newLoc = fileLoc.replace("file:///","");
	navigator.notification.progressStart("Importing CSV file","Importing...");
	window.plugins.CSVImportExport.importCSV(newLoc,
			function(){
			    console.log("csv import SUCCUSSS");
				getDirectoryEntries(got_direntries);
				navigator.notification.progressStop();
				$.mobile.changePage("#settings");
			},
			function(e){
				console.log(e);
			});
			
}

/*
 * Import CSV file of transactions from other phone
 * 
 */

function importOld(fileLoc){
	var newLoc = fileLoc.replace("file:///","");
	
	navigator.notification.progressStart("Importing CSV file","Importing...");
	window.plugins.CSVImportExport.importOld(newLoc,
			function(){
			    console.log("csv import SUCCUSSS");
				getDirectoryEntries(got_direntries);
				navigator.notification.progressStop();
				$.mobile.changePage("#settings");
			},
			function(e){
				console.log(e);
			});
			
}

/*
 * Export transactions to CSV file
 * 
 */

function exportCSV(fileLoc,transactions){
	
	window.plugins.CSVImportExport.exportCSV(fileLoc,transactions,
			function(){
			    console.log("plugin SUCCUSSS");
			    $.mobile.changePage("#settings");
			},
			function(e){
				console.log(e);
			});
}

function onConfirmExportCSV(buttonIndex){
	function extractalltransactions() {
		var rows = db_results.shift().rows;
		
		var len = rows.length;
		var export_string='All Transactions\r\n';
		export_string+='Date,Time,Amount,Balance,Location,Account_Num,Category\r\n';
		var prog_inc_val=0;
		if (len==0)
		export_string+='There are no transactions in the database yet\r\n';
		else
		 prog_inc_val= 100/len;
		
		for (var k=0; k<len; k++) {
			upProgress(k*prog_inc_val);
			export_string +=rows.item(k).Date+','+rows.item(k).Time+','+rows.item(k).Amount+','+rows.item(k).Balance+','+rows.item(k).Location+','+rows.item(k).Account_Num+','+rows.item(k).Category+'\r\n';
		}
		
		var newPath = currentDir.fullPath;
		var inputName = $('input#fileName').val();
		newPath = newPath.replace("file:///","");
		newPath = newPath + "/" + inputName;
		
		exportCSV(newPath,export_string);
		navigator.notification.progressStop();
		
	} //extractalltransactions
	if(buttonIndex == 2) {
		navigator.notification.progressStart("Exporting all Transactions","Exporting...");
		db_queries.push('SELECT * FROM SMS order by Date desc,Time desc');
		doTransactions(extractalltransactions)
	}
		
		
}

/*
 * Import from phone inbox
 * 
 */

function showConfirmImportInbox(){
	navigator.notification.confirm(
			'Do you want to import Inbox messages?',
			onConfirmImportInbox,
			'Import Inbox',
			'Cancel,Yes'
			);
}

function onConfirmImportInbox(buttonIndex){
	if(buttonIndex == 2)
		importInbox();
}

function enableFileSelector(){
	$('a#select').removeClass('ui-disabled');
	
	$.mobile.changePage("#fileselector");
	$('input#fileName').textinput('enable');
}

function disableFileSelector(val){
	importType = val;
	$('a#select').addClass('ui-disabled');
	
	$.mobile.changePage("#fileselector");
	$('input#fileName').textinput('disable');
}




