var db_results = new Array();
var db_queries = new Array();

var db_done_callback;



function doTransactions(callback) {
    db_done_callback = callback;
    db.transaction(db_executeQueries, db_error, db_transactionSuccess);

}
function db_executeQueries(tx) {
    tx.executeSql(db_queries.shift(), [], db_query_success, db_error);	
}

function db_query_success(tx, results){	
    db_results.push(results);	
}

function db_error(err) 
{
    if(debug_mode)
        alert("Error processing SQL: "+err.code);
}

function db_transactionSuccess() {
    console.log("transaction success");
    if (db_queries.length>0) {
        db.transaction(db_executeQueries, db_error, db_transactionSuccess);
    } else {
        db_done_callback();
    }
}


function doTransactionsNoResults(callback) {
    db_done_callback = callback;
    db.transaction(db_executeQueriesNoResults, db_error, db_transactionSuccessNoResults);
}

function db_executeQueriesNoResults(tx) {
    tx.executeSql(db_queries.shift());	
}

function db_transactionSuccessNoResults() {
    console.log("transaction success");
    if (db_queries.length>0) {
        db.transaction(db_executeQueriesNoResults, db_error, db_transactionSuccessNoResults);
    } else {
        db_done_callback();
    }
}
