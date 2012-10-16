function importCSV(fileLoc){
	navigator.notification.progressStart("Importing Inbox","Importing...");
	window.plugins.CSVImportExport.importCSV("BLAH",
			function(){
			    console.log("csv import SUCCUSSS");
				getDirectoryEntries(got_direntries);
				navigator.notification.progressStop();
			},
			function(e){
				console.log(e);
			});
			
}

function exportCSV(fileLoc,transactions){
	
	window.plugins.CSVImportExport.exportCSV(fileLoc,transactions,
			function(){
			    console.log("plugin SUCCUSSS");
			},
			function(e){
				console.log(e);
			});
}

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

function showConfirmImportCSV(){
	navigator.notification.confirm(
			'Do you want to import Inbox messages?',
			onConfirmImportCSV,
			'Import CSV file',
			'Cancel,Yes'
			);
}

function onConfirmImportCSV(buttonIndex){
	if(buttonIndex == 2)
		importCSV();
}

function showConfirmExportCSV(){
	navigator.notification.confirm(
			'Do you want to export your transactions to CSV file?',
			onConfirmExportCSV,
			'Export transactions',
			'Cancel,Yes'
			);
}

function onConfirmExportCSV(buttonIndex){
	function extractalltransactions() {
		var rows = db_results.shift().rows;
		
		var len = rows.length;
		var export_string='All Transactions\r\n';
		export_string+='Date,Time,Amount,Balance,Category,Account_Num\r\n';
		var prog_inc_val=0;
		if (len==0)
		export_string+='There are no transaction in the database yet\r\n';
		else
		 prog_inc_val= 100/len;
		
		for (var k=0; k<len; k++) {
			upProgress(k*prog_inc_val);
			export_string +=rows.item(k).Date+','+rows.item(k).Time+','+rows.item(k).Amount+','+rows.item(k).Balance+','+rows.item(k).Category+','+rows.item(k).Account_Num+'\r\n';
		}

		exportCSV('',export_string);
		navigator.notification.progressStop();
		
	} //extractalltransactions
	if(buttonIndex == 2) {
		navigator.notification.progressStart("Exporting all Transactions","Exporting...");
		db_queries.push('SELECT * FROM SMS order by Date desc,Time desc');
		doTransactions(extractalltransactions)
	}
		
		
}

