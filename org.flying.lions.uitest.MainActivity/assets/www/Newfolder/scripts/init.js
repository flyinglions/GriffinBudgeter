var db = null;
        var functionQueue = new Queue();
        var typeQueue = new Queue();
        
        var lastSql = "";
        
        var debug_mode=true;
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
            db.transaction(queryDB, error, success);
        }
        
        function queryDB(tx)
        {        
            var length = functionQueue.getLength();

            //alert("length of Queue:"+length);
            for(var i=0; i < length; i++)
            {

                var type = typeQueue.dequeue();
                var sqlVal = functionQueue.dequeue();
                //alert(type);
                //alert(sqlVal);
                lastSql = sqlVal;
                if(sqlVal != "")
                {
                    try
                    {
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
                            tx.executeSql(sqlVal);
                            //alert(sqlVal);
                        }
                        if(type == 'UPDATE')
                        {
                            tx.executeSql(sqlVal);
                            //alert(sqlVal);
                        }
                    }
                    catch(err)
                    {
					if (debug_mode)
                        alert(err.message+"\n"+sqlVal);
                    }
                    
                }
            }
            
            //alert('Data loaded succesfully!');

            global_trans = tx;
        }
        
        // Transaction error callback
        function error(err) 
        {
            console.log("Error processing SQL: "+err.code);
            if (debug_mode)
			alert("Error: Last SQL : "+lastSql+" , "+err.code+";"+err.message);
        }

        // Transaction success callback
        function success() 
        {
            console.log("success on database transaction.");
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
