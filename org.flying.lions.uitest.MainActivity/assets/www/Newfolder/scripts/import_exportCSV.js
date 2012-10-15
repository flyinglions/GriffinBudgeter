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
	if(buttonIndex == 2)
		exportCSV('','TRANSACTIONS');
}

