
var csvImportExport = function () {};

csvImportExport.prototype.importCSV = function(fileLocation,successCallback, failureCallback) {
    return PhoneGap.exec(successCallback, failureCallback, 'CSVImportExport',	'importCSV', [fileLocation]);
};

csvImportExport.prototype.exportCSV = function(fileLocation, data, successCallback, failureCallback) {
    return PhoneGap.exec(successCallback, failureCallback, 'CSVImportExport',	'exportCSV', [fileLocation, data]);
};


PhoneGap.addConstructor(function() {
	PhoneGap.addPlugin("CSVImportExport", new csvImportExport());
});
