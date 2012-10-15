function transactions_Header(theDate, theTotal)
{
    var tmp  = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    //tmp += 'Friday, October 8, 2012';
    tmp += theDate;
    tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
    
    return tmp;
}

function transactions_List(theAmount, theCategory, theAccount,theBalance)
{
   
	var tmp='<li><a href="index.html"><h3>'+theAccount+'</h3><p>'+theCategory+'</p><p class="ui-li-aside"><strong>R'+theAmount+'</strong></p></a>';
	tmp+='<a  href="javascript:deleteconfirm(\''+theAmount+'\',\''+theBalance+'\');" data-rel="popup" data-position-to="window" data-transition="pop"></a></li>';
    
    return tmp;
}

function deleteconfirm(damount,dbalance) {
	console.log("Perform deletion of transaction");
navigator.notification.confirm('Are you sure you want to delete the transaction',onconfirm,'Delete?','Cancel,Delete');
	function onconfirm(btnindex) {
		if (btnindex==2) {
			console.log("deleting transaction:"+damount+":"+dbalance);
			db.transaction(deletedoquery, db_error, deletesuccess);
			function deletedoquery(tx) { tx.executeSql('DELETE FROM "SMS" where Amount ='+damount+' and Balance='+dbalance) ; }
			function deletesuccess() { db.transaction(transactions_queryDB, transactions_errorCB); alert('Transaction deleted.');   }
			
		}
	}
	

}


function transactions_queryDB(tx) 
{
    tx.executeSql('SELECT * FROM SMS ORDER BY Date DESC, Time DESC LIMIT '+transactionlimit, [], transactions_Success, transactions_errorCB);
}

function transactions_Success(tx, results)
{
    var len = results.rows.length;
    
    var ht_str ='<h4>Overview:</h4>';
    if(len == 0)
    {
        ht_str +='<h3>No Bank Transactions Found</h3>';
    }
    
//Get Transactions
    var prevDate = "";
    if(len > 0)
    {
        prevDate = results.rows.item(0).Date;
    }
    var tmpCounter = 0;
    var tmpStr = "";
    var lastDate = "";
    for (var i=0; i<len; i++)
    {        
        if(prevDate != results.rows.item(i).Date)
        {
            prevDate = results.rows.item(i).Date;
            ht_str += transactions_Header(results.rows.item(i).Date, tmpCounter) + tmpStr;
            tmpStr = "";
            tmpCounter = 1;
        }
        else
        {
            tmpCounter++;
        }
        tmpStr += transactions_List(results.rows.item(i).Amount, results.rows.item(i).Category, results.rows.item(i).Account_Num,results.rows.item(i).Balance);
        lastDate = results.rows.item(i).Date;
    }
    
    if(len > 0)
    {
        ht_str += transactions_Header(lastDate, tmpCounter) + tmpStr;  
    }
                    
    $('ul#transactions').html(ht_str);
	$('ul#transactions').listview('refresh');
}

// Transaction error callback
//
function transactions_errorCB(err) 
{
    if(err.message == "undefined")
    {
        alert("Error processing SQL: "+err.code+" Message1:"+err.message);
    }
}