var Accounts = new Array();
var newAccounts = new Array();
var tmpSQL ="";

var Bank = new Array();
var BankUp = new Array();
var accName = new Array();
var accNameUp = new Array();

function swacc_queryDB(tx) 
{
    tx.executeSql('SELECT * FROM Bank_Account ORDER BY Bank', [], showaccounts_Success, showaccounts_errorCB);
    //tx.executeSql('SELECT * FROM sms', [], querySuccess, errorCB);
}

function showaccounts_header(headingTitle, theTotal)
{
    var tmp = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    tmp += headingTitle;
    tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
    return tmp;			
}

function showaccounts_content(theAccountName, theAccountNum,TheBalance)
{
    var tmp = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
    tmp += '<div class="ui-btn-inner ui-li">';
    tmp += '<div class="ui-btn-text">';
    tmp += '<a href="#transactions" class="ui-link-inherit">';
    tmp += '<h3 class="ui-li-heading">'+theAccountName+'</h3>';
    tmp += '<p class="ui-li-desc"><strong>'+theAccountNum+'</strong></p>';
    tmp += '<p class=" ui-li-aside ui-li-desc">'+TheBalance+'</p>';	
    tmp += '</a>';
    tmp += '</div>';
    tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
    return tmp;
}

function showaccounts_Success(tx, results)
{
    var len = results.rows.length;
    var ht_str ='<h4>Overview:</h4>';
    if(len == 0)
    {
        ht_str +='<h3>No accounts yet</h3>';
    }
    //ht_str = header('Wikus');

//Get Bank Accounts
    var tmpBank = "";
    var tmpStr = "";
    var accCounter = 0;
    var lastBank = "";
    
    if(len > 0)
    {
        tmpBank = results.rows.item(0).Bank;
    }
    
    for (var i=0; i<len; i++)
    {
        var thisBank = results.rows.item(i).Bank;
        if(tmpBank.toUpperCase() == thisBank.toUpperCase())
        {
            accCounter++;
            tmpStr += showaccounts_content(results.rows.item(i).Acc_Name, results.rows.item(i).Account_Num,results.rows.item(i).Balance);
        }
        else
        {
            ht_str += showaccounts_header(tmpBank, accCounter) + tmpStr;
            accCounter = 1;
            tmpBank = thisBank;
            tmpStr = showaccounts_content(results.rows.item(i).Acc_Name, results.rows.item(i).Account_Num,results.rows.item(i).Balance);
        }

        lastBank = thisBank;
    }
    if(len > 0)
    {
        ht_str += showaccounts_header(lastBank, accCounter) + tmpStr;
    }
    $('ul#acc').html(ht_str);                
}

// Transaction error callback
//
function showaccounts_errorCB(err) 
{
    alert("Error processing SQL: "+err.code);
}