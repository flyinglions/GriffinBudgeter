function transactions_Header(theDate, theTotal)
{
    var tmp  = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    //tmp += 'Friday, October 8, 2012';
    tmp += theDate;
    tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
    
    return tmp;
}

function transactions_List(theAmount, theCategory, theAccount)
{
    var tmp = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
    tmp += '<div class="ui-btn-text">';
    tmp += '<a href="transactions.html" class="ui-link-inherit">';
    //tmp += '<h3 class="ui-li-heading">ABSA: cheque account</h3>';
    tmp += '<h3 class="ui-li-heading">'+theAccount+'</h3>';
    //tmp += '<p class="ui-li-desc"><strong>Category: Other</strong></p>';
    tmp += '<p class="ui-li-desc"><strong>Category: '+theCategory+'</strong></p>';
    //tmp += '<p class=" ui-li-aside ui-li-desc">R1021.00</p>';
    tmp += '<p class=" ui-li-aside ui-li-desc">R'+theAmount+'</p>';
    tmp += '</a></div>';
    tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span>';
    tmp += '</div>';
    tmp += '</li>';
    
    return tmp;
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
        tmpStr += transactions_List(results.rows.item(i).Amount, results.rows.item(i).Category, results.rows.item(i).Account_Num);
        lastDate = results.rows.item(i).Date;
    }
    
    if(len > 0)
    {
        ht_str += transactions_Header(lastDate, tmpCounter) + tmpStr;  
    }
                    
    $('ul#transactions').html(ht_str);
}

// Transaction error callback
//
function transactions_errorCB(err) 
{
    alert("Error processing SQL: "+err.code);
}