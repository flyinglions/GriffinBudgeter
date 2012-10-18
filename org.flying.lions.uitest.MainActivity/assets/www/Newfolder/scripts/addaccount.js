
var add_Accounts = new Array();
var newadd_Accounts = new Array();
var tmpSQL ="";
var db;
var account_already_added=false;
var supported_Banks = new Array("ABSA","FNB");
var banks_added = false;
// Query the database
///
function addaccqueryDB(tx) {
    tx.executeSql('SELECT * FROM Bank_Account', [], bank_add_Accountsuccess, errorInsert);
    tx.executeSql('SELECT * FROM sms GROUP BY Account_Num', [], querySuccess, errorInsert);
}

function updateDB(tx) 
{
    //tmpSQL = "INSERT INTO Bank_Account (Account_Num, Bank, Acc_Name, Balance) VALUES ('SPR 1000','ABSA','Petrus van Der walt',0)";
    //alert(tmpSQL);
	
    tx.executeSql(tmpSQL);
    account_already_added = true;
    alert("Account added successfully!");
    $('select#selectmenu2').val("");
    $('select#bank').val("");
    $('#acc_name').val("");
}

function updateSuccess()
{
//alert('Insert Success');
}

function errorInsert(err) 
{
    if (debug_mode)
        alert("Error processing SQL: "+err.code+" : "+tmpSQL);
}

function errorCB(err) 
{
    if (debug_mode)
        alert("Error processing SQL: "+err.code+" : "+err.message);
}

function bank_add_Accountsuccess(tx, results)
{
    var len = results.rows.length;
    for (var i=0; i<len; i++)
    {
        add_Accounts.push(results.rows.item(i).Account_Num);
    }
}

// Query the success callback
//
function querySuccess(tx, results) {
    var len = results.rows.length;
    //alert(len);

    for (var i=0; i<len; i++)
    {
	    
        var accNum = results.rows.item(i).Account_Num;
        var isNew = true;
        for(var j = 0 ; j < add_Accounts.length; j++)
        {
            var tmp = add_Accounts[j];
            if(tmp.toUpperCase() == accNum.toUpperCase())
            {
                isNew = false;
            }
        }
        for(j = 0 ; j < newadd_Accounts.length; j++)
        {
            tmp = newadd_Accounts[j];
            if(tmp.toUpperCase() == accNum.toUpperCase())
            {
                isNew = false;
            }
        }
        if(isNew)
        {
            newadd_Accounts.push(accNum);
            $("#selectmenu2").append('<option name="'+sanitize(accNum)+'" value="'+accNum+'">'+accNum+'</option>');
            $("#selectmenu2").selectmenu("refresh");
        }
    }
    if(!banks_added)
    {
        for(i = 0 ; i < supported_Banks.length; i++)
        {
            $("#bank").append('<option name="'+supported_Banks[i]+'" value="'+supported_Banks[i]+'">'+supported_Banks[i]+'</option>');
            $("#bank").selectmenu("refresh");
        }
        banks_added = true;
    }
}



function doaddaccount() {
    console.log("adding account page");
    //$('#selectmenu2').html('');
    db.transaction(addaccqueryDB, errorCB, updateSuccess);
    startup();
				
}


function startup()
{
    $('input.update').click(function()
    {
        updateadd_Accounts();
    });
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

function addAccount(tmpAcc_Num, tmpBank, tmpAcc_Name)
{
    if (account_already_added)
        return;
    tmpSQL = "INSERT INTO Bank_Account (Account_Num, Bank, Acc_Name) VALUES ('"+tmpAcc_Num+"','"+tmpBank+"','"+tmpAcc_Name+"')";
    $('option[name="'+sanitize(tmpAcc_Num)+'"]').detach();
    //db = window.openDatabase("Database", "1.0", "Flying Lions Database", 10485760);
    //$('option[name='+tmpAcc_Num).remove();
    db.transaction(updateDB, errorCB);
}

function updateadd_Accounts() {
    var account_num = $('select#selectmenu2').val();
    if (account_num.length==0) {
        alert("No account selected");
        return;
    }

    var acc_name = $('input#acc_name').val();
    var bank =  $('select#bank').val();

    //alert("accnum"+account_num+"\nacc_name:"+acc_name+"\nbank:"+bank);
    addAccount(account_num,bank,acc_name);
}