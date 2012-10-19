var db = null;
var functionQueue = new Queue();
var typeQueue = new Queue();
        
var lastSql = "";
        
var debug_mode=false;
function createIfNotExistTables()
{
    functionQueue.enqueue('CREATE TABLE IF NOT EXISTS Bank_Account (Account_Num UNIQUE, Bank, Acc_Name, Balance)');
    typeQueue.enqueue('CREATE');
            
    functionQueue.enqueue('CREATE TABLE IF NOT EXISTS Budget_Items (Category UNIQUE,Budget_Amount,Remaining)');
    typeQueue.enqueue('CREATE');
            
    functionQueue.enqueue('CREATE TABLE IF NOT EXISTS sms (SMS_ID,Date,Time,Amount,Balance,Location,Account_Num,Category)');
    typeQueue.enqueue('CREATE');
            
    functionQueue.enqueue('CREATE TABLE IF NOT EXISTS Recon (Transaction_ID,Type,Recon,Account_Num,SMS_ID)');
    typeQueue.enqueue('CREATE');
    /*
                CREATE TRIGGER IF NOT EXISTS unique_row BEFORE INSERT ON sms 
                BEGIN 
                    DELETE FROM sms WHERE (Date = new.Date) AND (Amount = new.Amount) AND (Balance = new.Balance); 
                END;
             */
            
            
    functionQueue.enqueue('CREATE TRIGGER IF NOT EXISTS unique_row BEFORE INSERT ON sms BEGIN DELETE FROM sms WHERE (Date = new.Date) AND (Amount = new.Amount) AND (Balance = new.Balance); END;');
    typeQueue.enqueue('CREATE');
}
        
function dropTables()
{
    functionQueue.enqueue('DROP TABLE IF EXISTS Bank_Account');
    typeQueue.enqueue('DROP');
            
    functionQueue.enqueue('DROP TABLE IF EXISTS Budget_Items');
    typeQueue.enqueue('DROP');
            
    functionQueue.enqueue('DROP TABLE IF EXISTS sms');
    typeQueue.enqueue('DROP');
            
    functionQueue.enqueue('DROP TABLE IF EXISTS Recon');
    typeQueue.enqueue('DROP');
}
        
function checkQueue()
{
    console.log("CheckQueue");
    if (functionQueue.getLength()!=0)
        db.transaction(queryDB, error, success);
}
        
function sanitizeinsert(value)
{
    var newValue = value;

    newValue = replaceAll("&#39;", newValue);
    //newValue = replaceAll("\\'", newValue);
    //newValue = replaceAll("&", newValue);

    return newValue;
}

/*

var multiArrVal = new Array();

function checkIfExistInDb(value, tx)
{
    //INSERT INTO SMS(Date,Time,Amount,Balance,Location,Account_Num,Category) values('2012/06/30','1341076294478',
    //    -149.00,5324.98,'CELL C SP 20438923 101444079','TJEK2017','Telecommunications')
    //alert(value);
    var iPos = value.indexOf("values('");
    var tmpVal = value.substr(iPos+7);
    tmpVal = tmpVal.substr(0,tmpVal.length-1);
    //replaceAll(exp, value, newChar)
    tmpVal = replaceAll("'", tmpVal, "");
    var arrVal = tmpVal.split(",");
    multiArrVal.push(arrVal);
    //alert(arrVal);
    //db.transaction(searchDb, error);
    tx.executeSql('SELECT * FROM SMS WHERE Date="'+arrVal[0]+'" AND Time="'+arrVal[1]+'"', [], init_SelectSuccess, error);
}

function searchDb(tx)
{
    alert(multiArrVal);
    
}

function init_SelectSuccess(tx, results)
{
    var len = results.rows.length;
    alert(results.item(0).Date);
    if(len < 1)
    {
        var sql = "INSERT INTO SMS(Date,Time,Amount,Balance,Location,Account_Num,Category) values('";
        sql += arrVal[0]+"','"+arrVal[1]+"',"+arrVal[2]+","+arrVal[3]+",'"+arrVal[4]+"','"+arrVal[5]+"','"+arrVal[6]+"')";
        alert("Adding SMS");
        tx.executeSql(sql);
    }
    else
    {
        //if(debug_mode)
            alert("SMS not added to db, already exists->"+arrVal[0]+" "+arrVal[1]);
    }
}
*/

	
function queryDB(tx)
{        
    var length = functionQueue.getLength();

    //alert("length of Queue:"+length);
    var continueOnFail = true;
    for(var i=0; i < length; i++)
    {
				
        var type = typeQueue.dequeue();
        var sqlVal = functionQueue.dequeue();
        //alert(type);
        //alert(sqlVal);
        lastSql += "\n-------------------\n";
        lastSql = sqlVal;
        sqlVal = sanitizeinsert(sqlVal);
        if(sqlVal != "")
        {
            //try
            //{
            if(type == 'DROP')
            {
                //alert('Drop occured');
                tx.executeSql(sqlVal);
            }
            if(type == 'CREATE')
            {
                //alert('Create occured');
                tx.executeSql(sqlVal);
            }
            if(type == 'INSERT')
            {
                //Check if record exist, if not then adds it.
                //checkIfExistInDb(sqlVal, tx);
                            
                            
                tx.executeSql(sqlVal);
            //alert(sqlVal);
            }
            if(type == 'UPDATE')
            {
                tx.executeSql(sqlVal);
            //alert(sqlVal);
            }
        //}
        //catch(err)
        /*{
                        if (debug_mode)
                            alert(err.message+"\n"+sqlVal);
                    }*/
                    
        }
    }
            
    //alert('Data loaded succesfully!');

    global_trans = tx;
}
        
// Transaction error callback
function error(err) 
{
	if (debug_mode)
    console.log("Error processing SQL: "+err.code);
    if (debug_mode)
    alert("Error: Last SQL : "+lastSql+" , "+err.code+";"+err.message);
}

// Transaction success callback
function success() 
{
    console.log("success on database transaction.");
    lastSql = "";
    $('h3.loading').detach();
}
        
function importInbox() {
    navigator.notification.progressStart("Importing Inbox","Importing...");
    window.plugins.SMSReader.getInbox("",
        function(data){
            console.log("getINBOX+++++++++++Finised");
            getDirectoryEntries(got_direntries);
            navigator.notification.progressStop();
 
        },
        function(e){
            console.log(e);
        });
			

}
	    
function upProgress(value) 
{
    navigator.notification.progressValue(value);
}
	    
		
	/*	
 $( '#one' ).live( 'pageinit',function(event){

  init();
  
});*/
