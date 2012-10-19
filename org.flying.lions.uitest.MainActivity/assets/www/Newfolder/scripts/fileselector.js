var root = null; // File System root variable
var currentDir = null; // Current DirectoryEntry listed
var parentDir = null; // Parent of the current directory

var activeItem = null; // The clicked item
var activeItemType = null; // d-directory, f-file
var fileLocation = null;
 
/* get the root file system */
function getFileSystem(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function(fileSystem){ // success get file system
			console.log(fileSystem.name);
	        console.log(fileSystem.root.name);
			root = fileSystem.root;
			listDir(root);
		}, function(evt){ // error get file system
			console.log("File System Error: "+evt.target.error.code);
		}
	);
}


/* show the content of a directory */
function listDir(directoryEntry){
	if( !directoryEntry.isDirectory ) console.log('listDir incorrect type');
	$.mobile.showPageLoadingMsg(); // show loading message
	
	currentDir = directoryEntry; // set current directory
	directoryEntry.getParent(function(par){ // success get parent
		parentDir = par; // set parent directory
		if( (parentDir.name == 'sdcard' && currentDir.name != 'sdcard') || parentDir.name != 'sdcard' ) $('#backBtn').show();
	}, function(error){ // error get parent
		console.log('Get parent error: '+error.code);
	});
	
	var directoryReader = directoryEntry.createReader();
	directoryReader.readEntries(function(entries){
		var dirContent = $('#dirContent');
		dirContent.empty();
		
		var dirArr = new Array();
		var fileArr = new Array();
		for(var i=0; i<entries.length; ++i){ // sort entries
			var entry = entries[i];
			if( entry.isDirectory && entry.name[0] != '.' ) dirArr.push(entry);
			else if( entry.isFile && entry.name[0] != '.' ) fileArr.push(entry);
		}
		
		var sortedArr = dirArr.concat(fileArr); // sorted entries
		var uiBlock = ['a','b','c','d'];
		
		for(var i=0; i<sortedArr.length; ++i){ // show directories
			var entry = sortedArr[i];
			var blockLetter = uiBlock[i%4];
			//console.log(entry.name);
			if( entry.isDirectory )
				dirContent.append('<div class="ui-block-'+blockLetter+'"><div class="folder"><p>'+entry.name+'</p></div></div>');
			else if( (entry.isFile)&&(entry.name.indexOf(".csv") != -1))
				dirContent.append('<div class="ui-block-'+blockLetter+'"><div class="file"><p>'+entry.name+'</p></div></div>');
		}
		var dirPath = currentDir.fullPath;
		$('h4#dirTree').html(dirPath.replace("file:///mnt",".."));
		$.mobile.hidePageLoadingMsg(); // hide loading message
	}, function(error){
		console.log('listDir readEntries error: '+error.code);
	});
	
	
}

/* read from file */
function selectFile(fileEntry){
	if( !fileEntry.isFile ) console.log('readFile incorrect type');
	if(importType == 1)
		importCSV(fileEntry.fullPath);
	if(importType == 2)
		importOld(fileEntry.fullPath);

}

/* open item */
function openItem(type){
	if( type == 'd' ){
		listDir(activeItem);
	} else if(type == 'f'){
		selectFile(activeItem);
	}
}

/* get active item  */
function getActiveItem(name, type){
	if( type == 'd' && currentDir != null ){
		currentDir.getDirectory(name, {create:false},
			function(dir){ // success find directory
				activeItem = dir;
				activeItemType = type;
				openItem(activeItemType);
			}, 
			function(error){ // error find directory
				console.log('Unable to find directory: '+error.code);
			}
		);
	} else if(type == 'f' && currentDir != null){
		currentDir.getFile(name, {create:false},
			function(file){ // success find file
				activeItem = file;
				activeItemType = type;
				openItem(activeItemType);
			},
			function(error){ // error find file
				console.log('Unable to find file: '+error.code);
			}
		);
	}
	
	
}


/* click actions */
function clickItemAction(){
	var folders = $('.folder');
	var files = $('.file');
	var backBtn = $('#backBtn');
	var homeBtn = $('#homeBtn');
	
	folders.live('click', function(){
		var name = $(this).text();
		getActiveItem(name, 'd');
		
	});
	
	files.live('click', function(){
		var name = $(this).text();
		getActiveItem(name, 'f');

		
	});
	
	backBtn.click(function(){ // go one level up
		if( parentDir != null ) 
			listDir(parentDir);
	});
	
	homeBtn.click(function(){ // go to root
		if( root != null ) 
			listDir(root);
	});
	
	
}

function returnDirPath(){
	//alert(currentDir.fullPath);
	onConfirmExportCSV(2);

}
