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

var  transactionlimit=15;

function installFileOri(){
    console.log("FINISH");
    transactionlimit = INIget('settings','transmax');
}

function onMenuKeyDown(){
		
    console.log("MENU");
    //navigator.app.loadUrl("#settings");
			
    $.mobile.changePage("#settings");
}

function onDeviceReady()
{

    document.addEventListener("menubutton", onMenuKeyDown, false);

    startINI(installFileOri);
    isPhoneGapReady = true;
	
    isFirstRun = true;
    
    //checkTransAdd();
	
	
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
	
    /*db_queries.push('select Bank, b.Account_Num as num ,b.Acc_Name as Acc, sum(Amount) as Am from sms s JOIN Bank_Account b ON (s.Account_Num=b.Account_Num) where (s.Amount < 0) group by b.Account_Num ');
	db_queries.push('select Bank, b.Account_Num as num,b.Acc_Name as Acc, sum(Amount) as Am from sms s JOIN Bank_Account b ON (s.Account_Num=b.Account_Num) where (s.Amount > 0) group by b.Account_Num ');*/
    db_queries.push('select * from Bank_Account');
    doTransactions(getprev);
	
    //doaddaccount();
	
    //db.transaction(swacc_queryDB, showaccounts_errorCB);
    //db.transaction(transactions_queryDB, transactions_errorCB);
    //db.transaction(addaccqueryDB, errorInsert);
	
	
	
    //Any startup events
    executeStartupEvents();
	
	
    $( '#one' ).live( 'pageshow',
        function(event){
  
            //in main index page -> show the accounts and their balances
            //do the actual database queries
            //select * from sms s where s.Account_Num IN (select b.Account_Num from Bank_Account b)  group by Account_Num order by date desc
            //db_queries.push('select b.Bank as theBank,s.Balance as bal,b.Account_Num as num,b.Acc_Name as Acc  from sms s JOIN Bank_Account b ON (s.Account_Num=b.Account_Num)  group by num order by Date desc');
            //db_queries.push('select Bank, b.Account_Num as num ,b.Acc_Name as Acc, s.Balance as Am from sms s JOIN Bank_Account b ON (s.Account_Num=b.Account_Num) where s.Date IN (select Date from sms ss where ss.Account_Num=s.Account_Num order by Date desc limit 1)  group by b.Account_Num ');
            //db_queries.push('select Bank, b.Account_Num as num,b.Acc_Name as Acc, Amount as Am from sms s JOIN Bank_Account b ON (s.Account_Num=b.Account_Num) where s.Amount  group by b.Account_Num ');
            db_queries.push('select * from Bank_Account');
            doTransactions(getprev);
	
        //db.transaction(swacc_queryDB, showaccounts_errorCB);
        }
        );
	
	
    $( '#addacc' ).live( 'pageshow',
        function(event){
            account_already_added = false;
            //execute add account scripts (addaccount page)
            doaddaccount();
        }
        );
	
    $( '#transactions' ).live( 'pageshow',
        function(event){
            currentpage=0;
            refreshtransactions(false);
			
		
        }
        );
	
	
    $( '#settingsAccounts' ).live( 'pageshow',
        function(event){
  
            //execute settingsAccounts scripts 
            showsettingsaccounts();
        }
        );
	
    $( '#graphsettings' ).live( 'pageshow',
        function(event){
  
            //execute graphsettings scripts
            showgraphsettings();
        }
        );
	
	
    $( '#graphsettings' ).live( 'pagehide',
        function(event){
  
            //execute graphsettings scripts (when transitioning to another page)
            hidegraphsettings();
        }
        );
	
    $( '#transactionspopup' ).live( 'pageshow',
        function(event){
  
            //execute transactionspopup scripts
            db_queries.push('select Account_Num,Acc_Name from Bank_Account');
            doTransactions(updateAccountsOnPopup);
        }
        );
	
	
    /*
	 * 
	 * Swipe events for every page
	 */
    $('#one').live('swipeleft swiperight',function(event){
        if (event.type == "swipeleft") {
            $.mobile.changePage('#transactions');
             
        }

    });
	 
   /* $('#transactions').live('swipeleft swiperight',function(event){
        if (event.type == "swipeleft") {
            $.mobile.changePage('#graphMenu');
             
        }
        if (event.type == "swiperight") {
            $.mobile.changePage('#one');
             
        }
    });*/
	 
    $('#graphMenu').live('swipeleft swiperight',function(event){
        if (event.type == "swipeleft") {
            $.mobile.changePage('#settings');
             
        }
        if (event.type == "swiperight") {
            $.mobile.changePage('#transactions');
             
        }
    });
	 
    $('#settings').live('swipeleft swiperight',function(event){
        if (event.type == "swiperight") {
            $.mobile.changePage('#graphMenu');
             
        }
    });
	
	
    navigator.splashscreen.hide();
	

}

window.onbeforeunload  =  function(e)
{
    window.plugins.SMSReceiverPlugin.unregister(null, null); 
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

function replaceAll(exp, value, newChar)
{
    var newValue = value;
    while(newValue.indexOf(exp) > -1)
    {
        newValue = newValue.replace(exp,newChar);
    }
    return newValue;
}

function got_direntries() {					
    //alert("got entries");
	
    //alert(text_array.length);
    var k=0;
    for (k=0;k<text_array.length; k++) 
    {
        //alert(text_array[k]);//Wikus:)
        var theData = text_array[k];
        /*theData = replaceAll('\n',theData,'');
            theData = replaceAll('\r',theData,'');*/
        //theData = replaceAll('\'',theData,'');
            
        var tmpData = theData.split('\r\n');
        for(var i = 0 ; i < tmpData.length; i++)
        {
            //alert(tmpData[i]);
            var statement = tmpData[i];
            statement = statement.toUpperCase();
            //alert(tmpData[i]);
                
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