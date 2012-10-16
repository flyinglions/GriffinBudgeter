var Accounts = new Array();
var newAccounts = new Array();
var tmpSQL ="";

var Bank = new Array();
var BankUp = new Array();
var accName = new Array();
var accNameUp = new Array();

var prevvals='';
function getprev() {
//prevvals = 
readFile('MEM/ORI/prevValue.txt',gotprev);

}
function gotprev(txt) {
prevvals = txt;
//alert(txt);
showaccounts_Success();
}

/*function swacc_queryDB(tx) 
{ tx.executeSql('SELECT * FROM Bank_Account', [], showaccounts_Success, showaccounts_errorCB);
	
   // tx.executeSql('SELECT * FROM Bank_Account b,SMS s where b.Account_Num=s.Account_Num group by s.Date desc ORDER BY Bank groupd by b.Account_Num', [], showaccounts_Success, showaccounts_errorCB);
    //tx.executeSql('SELECT * FROM sms', [], querySuccess, errorCB);
}*/

function showaccounts_header(headingTitle, theTotal)
{
    var tmp = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    tmp += headingTitle;
    tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
    return tmp;			
}

function showaccounts_content(theAccountName, theAccountNum, TheBalance, theBank)
{
    /*var tmp = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
    tmp += '<div class="ui-btn-inner ui-li">';
    tmp += '<div class="ui-btn-text">';
    tmp += '<a href="#settingsAccounts" class="ui-link-inherit">';
    tmp += '<h3 class="ui-li-heading">'+theAccountName+'</h3>';
    tmp += '<p class="ui-li-desc"><strong>'+theAccountNum+'</strong></p>';
    tmp += '<p class=" ui-li-aside ui-li-desc">'+TheBalance+'</p>';	
    tmp += '</a>';
    tmp += '</div>';
    tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';*/
    var tmp;
    if(theBank == "FNB")
    {
        tmp='<li style="background-image:url(\'fnb.png\'); background-size:80px 50px; background-repeat:no-repeat; background-position:center top;"><a href="#settingsAccounts"><h3>'+theAccountName+'</h3><p>'+theAccountNum+'</p><p class="ui-li-aside"><strong>'+TheBalance+'</strong></p></a>';
    }
    else
    {
        if(theBank == "ABSA")
        {
            tmp='<li style="background-image:url(\'absa.png\'); background-size:80px 50px; background-repeat:no-repeat; background-position:center top;"><a href="#settingsAccounts"><h3>'+theAccountName+'</h3><p>'+theAccountNum+'</p><p class="ui-li-aside"><strong>'+TheBalance+'</strong></p></a>';
        }
        else
        {
            tmp='<li><a href="#settingsAccounts"><h3>'+theAccountName+'</h3><p>'+theAccountNum+'</p><p class="ui-li-aside"><strong>'+TheBalance+'</strong></p></a>';
        }
    }
    

	tmp+='<a  href="javascript:deleteAccSettings(\''+theAccountNum+'\');" data-rel="popup" data-position-to="window" data-transition="pop"></a></li>';
    return tmp;
}

function getBalancefromPrev(num) {

if (num=='')
return '0.0';
var k  =prevvals.indexOf(num);
if (k<0)
	return '0.0';
var p =  prevvals.substring(k);
var p = p.substring(num.length+1,p.indexOf(';'));
return p;
}

function showaccounts_Success()
{
    
	//var db_expense = db_results.shift().rows;
	//var db_income = db_results.shift().rows;
	var bal = db_results.shift().rows;
	var len = bal.length;
	//alert(len);
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
	//alert(bal.item(0).Bank+':'+bal.item(0).Account_Num+':'+bal.item(0).Acc_Name);
        tmpBank = bal.item(0).Bank;
    }
    var prevacc='';
    for (var k=0; k<len; k++)
    {
	if (prevacc==bal.item(k).Account_Num) {	
	break;
	}
	prevacc=bal.item(k).Account_Num;
	var thebalance ='R'+ getBalancefromPrev(prevacc);
	
	//alert(bal.item(k).Acc_Name+bal.item(k).Account_Num+'=='+thebalance+'=='+bal.item(k).Bank);
	
	//var expense = Math.round(db_expense.item(k).Am);
	/*var income =0;
	if (k<db_income.length)
	income = Math.round(db_income.item(k).Am);*/
	//var bal = income+expense;
	//db_expense.item(k).Bank+' '+db_expense.item(k).Acc+': Balance '+bal
        var thisBank = bal.item(k).Bank;
        //thisBank = "AfricaBank";
		
        if(tmpBank.toUpperCase() == thisBank.toUpperCase())
        {
            accCounter++;
            tmpStr += showaccounts_content(bal.item(k).Acc_Name,bal.item(k).Account_Num,thebalance,thisBank.toUpperCase());
        }
        else
        {
            ht_str += showaccounts_header(tmpBank, accCounter) + tmpStr;
            //alert(tmpBank+":"+accCounter);
            accCounter = 1;
            tmpBank = thisBank;
            
            tmpStr = showaccounts_content(bal.item(k).Acc_Name, bal.item(k).Account_Num,thebalance,thisBank.toUpperCase());
        }

        lastBank = thisBank;
    }
    if(len > 0)
    {
        ht_str += showaccounts_header(lastBank, accCounter) + tmpStr;
    }
    $('ul#acc').html(ht_str);                
    $('ul#acc').listview("refresh");    
}

// Transaction error callback
//
function showaccounts_errorCB(err) 
{
    if (debug_mode)
	alert("Error processing SQL: "+err.code);
}