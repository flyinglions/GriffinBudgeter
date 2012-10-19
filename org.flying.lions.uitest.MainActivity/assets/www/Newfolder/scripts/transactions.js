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
            function deletedoquery(tx) {
                tx.executeSql('DELETE FROM "SMS" where Amount ='+damount+' and Balance='+dbalance) ;
            }
            function deletesuccess() {
                db.transaction(transactions_queryDB, transactions_errorCB);
                alert('Transaction deleted.');
            }
			
        }
    }
	

}

var currentpage=0;
function transactions_queryDB(tx) 
{
    tx.executeSql('SELECT * FROM Bank_Account', [], transactions_Accountsuccess, transactions_errorCB);

    var where=''
    if (filter_account!='')
        where = 'WHERE Account_Num=\''+filter_account+'\'';

    var limiting='';
    if (!infinityview)
        limiting = 'LIMIT '+transactionlimit +' OFFSET '+(currentpage*transactionlimit);
    //tx.executeSql('SELECT * FROM (SELECT * FROM SMS GROUP BY Date, Time) '+where+' ORDER BY Date DESC, Time DESC  LIMIT '+transactionlimit, [], transactions_Success, transactions_errorCB);
    tx.executeSql('SELECT * FROM sms '+where+' ORDER BY Date DESC, Time DESC '+limiting , [], transactions_Success, transactions_errorCB);
    tx.executeSql('SELECT * FROM sms', [], newtransactions_Accountsuccess, transactions_errorCB);
    
    
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

function newtransactions_Accountsuccess(tx, results)
{
    var len = results.rows.length;
    $('select#newTransAccNum').val("");
    
    for(var i = 0 ; i < len; i++)
    {
        //newtransactions_AccNum.push(results.rows.item(i).Account_Num);
        $('#newTransAccNum option[name="'+sanitize(results.rows.item(i).Account_Num)+'"]').detach();
        $("#newTransAccNum").append('<option name="'+sanitize(results.rows.item(i).Account_Num)+'" value="'+results.rows.item(i).Account_Num+'">'+results.rows.item(i).Account_Num+'</option>');
        //$("#newTransAccNum").selectmenu("refresh");
        
    }
    
    startINI(function()
    {
        var arrCatsTrans = INIgetsection('categories');
        for (i=0; i<arrCatsTrans.length; i++)
        {
            $('#newTransCat option[name="'+sanitize(arrCatsTrans[i].name)+'"]').detach();
            $("#newTransCat").append('<option name="'+sanitize(arrCatsTrans[i].name)+'" value="'+arrCatsTrans[i].name+'">'+arrCatsTrans[i].name+'</option>');
            //$("#newTransCat").selectmenu("refresh");
        }
    });
}

function checkTransAdd()
{
    //$('div#newtransactionspopup input.AddTrans').click(function()
    //{
        db.transaction(insertTransactionManually, transactions_errorCB);
    //});
}

function insertTransactionManually(tx)
{
    /*
     *  <label>Date</label><input type="text" value="" placeholder="yyyy/mm/dd"/>
                    <label>Time</label><input type="text" value="0" />
                    <label>Amount</label><input type="text" value="0.0" />
                    <label>Category</label><select name="Category" id="newTransCat"></select>
                    <label>Account_Num</label><select name="bank" id="newTransAccNum"></select>
     */
    if($('div#newtransactionspopup input.date').val() != '')
    {
        if($('div#newtransactionspopup input.amount').val() != '')
        {
            tx.executeSql("INSERT INTO sms(Date, Time, Amount, Balance, Category, Account_Num) VALUES('"+$('div#newtransactionspopup input.date').val()+"','0','"+$('div#newtransactionspopup input.amount').val()+"','0','"+$('div#newtransactionspopup select#newTransCat').val()+"','"+$('div#newtransactionspopup select#newTransAccNum').val()+"')");
        }
    }
    
    $('div#newtransactionspopup input.date').val("");
    $('div#newtransactionspopup input.amount').val("");
    $('div#newtransactionspopup select#newTransCat').val("");
    $('div#newtransactionspopup select#newTransAccNum').val("");
}

function replaceAlltwo(exp, value)
{
    var newValue = value;
    while(newValue.indexOf(exp) > -1)
    {
        newValue = newValue.replace(exp,"_");
    }
    return newValue;
}

function sanitize(value)
{
    var newValue = value;

    newValue = replaceAlltwo(".", newValue);
    newValue = replaceAlltwo("/", newValue);
    newValue = replaceAlltwo(" ", newValue);
	

    return newValue;
}

infinityview=false;
function transactions_Success(tx, results)
{
    var len = results.rows.length;
    var fromstr = '';
    if (filter_account!='')
        fromstr = ' from "'+filter_account_name+'"';
    var ht_str ='<h4>Overview:</h4>';
    if(len == 0 && currentpage==0)
    {
        ht_str +='<h3>No Bank Transactions Found</h3>';
    } else if (len==0 && infinityview==false) {
        ht_str +='<h3>No other Transactions Found</h3>';
    } else if (infinityview==false) {
        var tbegin = currentpage*transactionlimit;
        var tend = currentpage*transactionlimit+len;
        ht_str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Showing transactions ('+tbegin+' through ' +tend+')'+fromstr+'.</li>';
        ht_str+='<li><div data-role="controlgroup" data-type="horizontal" ><a href="javascript:refreshtransactions(true);" data-theme="b" data-role="button" data-icon="refresh" >Show all transaction. No Limit</a></div></li> ';
    } else if (infinityview) {
        ht_str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Showing all transactions ('+len+')'+fromstr+'.</li>';
        ht_str+='<li><div data-role="controlgroup" data-type="horizontal" ><a href="javascript:refreshtransactions(false);" data-theme="b" data-role="button" data-icon="refresh">Limit the number of transactions</a></div></li> ';
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
            ht_str += transactions_Header(prevDate, tmpCounter) + tmpStr;           
            prevDate = results.rows.item(i).Date;
           
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
    if (len !=0 || currentpage>0 && infinityview==false) {
        ht_str+='<li><div data-role="controlgroup" data-type="horizontal" >';
        if(currentpage>0)
            ht_str+='<a href="javascript:transgoback();" data-theme="b" data-role="button" data-icon="arrow-l" >Previous '+transactionlimit+'</a>';
        if(len==transactionlimit)
            ht_str+='<a href="javascript:transgonext(\''+len+'\');" data-theme="b" data-role="button" data-icon="arrow-r" >Next '+transactionlimit+'</a>';
        ht_str+='</div></li>';
    }        
    $('ul#transactions').html(ht_str);
    $('ul#transactions').listview('refresh');
    $('ul#transactions').trigger('create');
	
	
}

function transgoback() { 
    if (currentpage<=0) return; 
    currentpage-=1;
    refreshtransactions(infinityview);
}
function refreshtransactions(infin) {
    infinityview = infin;
    $('ul#transactions').html('<h3>Loading...</h3>');
    db.transaction(transactions_queryDB, transactions_errorCB); 
}

function transgonext(len) { 
    if (len==transactionlimit) {
        currentpage+=1;  
        refreshtransactions(infinityview);
    } 
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
var filter_account_name='';
function filtertransaction(acc_num,acc_name) {
    filter_account_name=acc_name;
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
            updatestr+='<li><a href="javascript:filtertransaction(\''+rows.item(k).Account_Num+'\',\''+rows.item(k).Acc_Name+'\')">'+rows.item(k).Acc_Name+'</a></li>';
        }
    }
	
    $('ul#transpopupui').html(updatestr);
    $('ul#transpopupui').listview('refresh');
//$('ul#transpopupui').listview('refresh');
	
}