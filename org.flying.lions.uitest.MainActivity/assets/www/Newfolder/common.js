//Global var for Phonegap ready
var isPhoneGapReady = false;

//global var to check if app is runned for first time: few events should run then
var firstRun = true;


function init()
{
$.mobile.defaultPageTransition="none";

//console.log("****************************************\n\n\n\n*********************************************************");
	if(isPhoneGapReady)
		{
			onDeviceReady();
		}
	else
		{
			document.addEventListener("deviceready", onDeviceReady, false);
		}
	
}

function installFileOri(){
	console.log("FINISH");
}

	function onMenuKeyDown(){
		
			console.log("MENU");
			//navigator.app.loadUrl("#settings");
			
			$.mobile.changePage("#settings");
		}

function onDeviceReady()
{
navigator.splashscreen.hide();
document.addEventListener("menubutton", onMenuKeyDown, false);

    startINI(installFileOri);
	isPhoneGapReady = true;
	
	isFirstRun = true;
	
	
	/*read all files in MEM and delete them*/
	getDirectoryEntries(got_direntries);
	
	/*Code for opening the Database: Wikus*/
	db = window.openDatabase("Database", "1.0", "Flying Lions Database", 10485760);
	//alert("ready");
	//dropTables();	
	createIfNotExistTables();
	checkQueue();
	
	//in main index page -> show the accounts and their balances
	//do the actual database queries
	db.transaction(swacc_queryDB, showaccounts_errorCB);
        db.transaction(transactions_queryDB, transactions_errorCB);
        db.transaction(addaccqueryDB, errorInsert);
	
	
	
	//Any startup events
	executeStartupEvents();
	
	
	 $( '#one' ).live( 'pageshow',
		function(event){
  
		//in main index page -> show the accounts and their balances
		//do the actual database queries
		db.transaction(swacc_queryDB, showaccounts_errorCB);
		}
	);
	
	
	$( '#addacc' ).live( 'pageshow',
		function(event){
  
		//execute add account scripts (addaccount page)
		doaddaccount();
		}
	);
	

	

}



function executeStartupEvents(){
	if(isPhoneGapReady)
		{
			   document.addEventListener("resume", onResume, false);
			   document.addEventListener("pause", onPause, false);
			   //document.addEventListener("backbutton", backKeyDown, false);
			
			     
			   	window.plugins.SMSReceiverPlugin.register("smscallback", function()
					{
					    console.log("Registration ok");
					}, function (e)
					{
					    console.log("Registration NOT ok: " + e);
					});
					
		   
				function onResume(buttonIndex) {
					if(isPhoneGapReady == false){
						init();
						
					}
					else{
						//alert('Resuming');
						console.log("Resuming");
					}
				    
				}   
				
				function onPause() {
				    isPhoneGapReady = false;
				    //console.log("PAAAAAAAAAAAAAAAAAAUUUUSSSSSSSSSSSSEEEE");
				} 		
				
				function backKeyDown(e) {
				    isPhoneGapReady = false;
				    //e.preventDefault();
				    //onPause();
				    //console.log("BAAAAAAAAAAAAACCCCCCCCCCCCKKKKKKKKKKKKK");
				    //navigator.app.backHistory();
				    //window.history.back();
				} 	

				
				
				
			   
		
		}

}

function notificationCallback(){
	getDirectoryEntries(got_direntries);
	if(isPhoneGapReady == false){
		window.plugins.StatusBarNotification.notify("Decoded SMS", "New Decoded msg");
	}
	else
		{
			alert("New decoded SMS received");
		}
	
	
	
}

/*window.onbeforeunload  =  function(e)
{
	window.plugins.SMSReceiverPlugin.unregister(null, null); 
}*/


function got_direntries() {					
	//alert("got entries");
	
	 //alert(text_array.length);
	var k=0;
	for (k=0;k<text_array.length; k++) 
        {
	//alert(text_array[k]);//Wikus:)
            var tmpData = text_array[k].split('\r\n');
            for(var i = 0 ; i < tmpData.length; i++)
            {
                //alert(tmpData[i]);
                var statement = tmpData[i];
                statement = statement.toUpperCase();
                
                if(statement.indexOf("RECON") < 0)
                {    
                    functionQueue.enqueue(tmpData[i]);
                    typeQueue.enqueue('INSERT');
                }
            }
	//process text...sql
	
	}
        //alert(tmpData);
        
        checkQueue();
}
				//readFile("/sdcard/MEM/");
				//alert('Pieter');