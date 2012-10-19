/*
 * Import CSV file of SMSes
 * 
 */

function importCSV(fileLoc){
    navigator.notification.progressStart("Importing CSV file","Importing...");
    window.plugins.CSVImportExport.importCSV("test.csv",
        function(){
            console.log("csv import SUCCUSSS");
            getDirectoryEntries(got_direntries);
            navigator.notification.progressStop();
        },
        function(e){
            console.log(e);
        });
			
}

function showConfirmImportCSV(){
    navigator.notification.confirm(
        'Do you want to import SMSes from CSV file?',
        onConfirmImportCSV,
        'Import CSV file',
        'Cancel,Yes'
        );
}

function onConfirmImportCSV(buttonIndex){
    if(buttonIndex == 2)
        importCSV();
}

/*
 * Import CSV file of transactions from other phone
 * 
 */

function importOld(fileLoc){
    navigator.notification.progressStart("Importing CSV file","Importing...");
    window.plugins.CSVImportExport.importOld("export.csv",
        function(){
            console.log("csv import SUCCUSSS");
            getDirectoryEntries(got_direntries);
            navigator.notification.progressStop();
        },
        function(e){
            console.log(e);
        });
			
}

function showConfirmImportOld(){
    navigator.notification.confirm(
        'Do you want to import transactions from CSV file?',
        onConfirmImportOld,
        'Import CSV file',
        'Cancel,Yes'
        );
}

function onConfirmImportOld(buttonIndex){
    if(buttonIndex == 2)
        importOld();
}

/*
 * Export transactions to CSV file
 * 
 */

function exportCSV(fileLoc,transactions){
	
    window.plugins.CSVImportExport.exportCSV(fileLoc,transactions,
        function(){
            console.log("plugin SUCCUSSS");
        },
        function(e){
            console.log(e);
        });
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

        exportCSV('',export_string);
        navigator.notification.progressStop();
		
    } //extractalltransactions
    if(buttonIndex == 2) {
        navigator.notification.progressStart("Exporting all Transactions","Exporting...");
        db_queries.push('SELECT * FROM SMS order by Date ,Time ');
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




