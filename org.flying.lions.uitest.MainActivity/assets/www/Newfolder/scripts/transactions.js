var transactions_AccName = new Array();
var transactions_Bank = new Array();
var transactions_AccNum = new Array();

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
    var iPos = transactions_AccNum.indexOf(theAccount);
    var tmp;
    if(iPos > -1)
    {
        var tmp_Bank = transactions_Bank[iPos].toUpperCase();
        if(tmp_Bank == "FNB")
        {
            tmp='<li style="background-image:url(\'fnb.png\'); background-size:60px 40px; background-repeat:no-repeat; background-position:center left;"><a href="#transactions"><h3 style="position: relative; left: 60px;">'+transactions_AccName[1*iPos]+'</h3><p style="position: relative; left: 60px;">'+theCategory+'</p><p class="ui-li-aside"><strong>R'+theAmount+'</strong></p></a>';
        }
        else
        {
            tmp='<li style="background-image:url(\'absa.png\'); background-size:60px 40px; background-repeat:no-repeat; background-position:center left;"><a href="#transactions"><h3 style="position: relative; left: 60px;">'+transactions_AccName[1*iPos]+'</h3><p style="position: relative; left: 60px;">'+theCategory+'</p><p class="ui-li-aside"><strong>R'+theAmount+'</strong></p></a>';
        }
    }
    else
    {
        tmp='<li><a href="#transactions"><h3 style="position: relative; left: 60px;">'+theAccount+'</h3><p style="position: relative; left: 60px;">'+theCategory+'</p><p class="ui-li-aside"><strong>R'+theAmount+'</strong></p></a>';
    }
    
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
    tx.executeSql('SELECT * FROM Bank_Account', [], transactions_Accountsuccess, transactions_errorCB);

var where=''
if (filter_account!='')
where = 'WHERE Account_Num=\''+filter_account+'\'';
    //tx.executeSql('SELECT * FROM (SELECT * FROM SMS GROUP BY Date, Time) '+where+' ORDER BY Date DESC, Time DESC  LIMIT '+transactionlimit, [], transactions_Success, transactions_errorCB);
    tx.executeSql('SELECT * FROM sms '+where+' ORDER BY Date DESC, Time DESC  LIMIT '+transactionlimit, [], transactions_Success, transactions_errorCB);
}

function transactions_Accountsuccess(tx, results)
{
    var len = results.rows.length;
    
    for(var i = 0 ; i < len; i++)
    {
        transactions_Bank.push(results.rows.item(i).Bank);
        transactions_AccName.push(results.rows.item(i).Acc_Name);
        transactions_AccNum.push(results.rows.item(i).Account_Num);
    }
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
	if (debug_mode)
        alert("Error processing SQL: "+err.code+" Message1:"+err.message);
    }
	
}

//functionlityu for filtering by account
var filter_account='';
function filtertransaction(acc_num) {
filter_account = acc_num;
$.mobile.changePage($("#transactions"));
}

function updateAccountsOnPopup() {
	var rows = db_results.shift().rows;
	var updatestr='';
	if (rows==undefined) {
	updatestr='<h3>No Accounts added yet</h3>';
	} else {
		var len = rows.length;
		var updatestr ='<li data-role="divider" data-theme="a">Choose Account</li>';
		updatestr+='<li><a href="javascript:filtertransaction(\'\')">Show all transactions</a></li>';
		for (var k=0; k<len; k++) {
			updatestr+='<li><a href="javascript:filtertransaction(\''+rows.item(k).Account_Num+'\')">'+rows.item(k).Account_Num+'</a></li>';
		}
	}
	
	$('ul#transpopupui').html(updatestr);
	$('ul#transpopupui').listview('refresh');
	//$('ul#transpopupui').listview('refresh');
	
}