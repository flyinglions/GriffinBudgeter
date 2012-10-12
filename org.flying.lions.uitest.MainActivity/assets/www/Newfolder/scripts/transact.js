var translimit=50;
function gettransactionslimit() {
translimit = INIget('settings','transmax');
doShowPageTransactions();
}
function doShowPageTransactions() {
db_queries.push('select s.Date, b.Bank,b.Acc_Name,s.Amount,s.Category from Bank_Account b,sms s order by Date desc limit '+translimit);
doTransactions(transactshow);
}

function transactshow() {
console.log('beggining transact show');
	var str ='';
	var rows = db_results.shift().rows;
	var len = rows.length;
	var prevdate='nodate';
	str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">showing previous '+translimit+' transactions</li>';
	for (var k=0; k<len; k++) {
	var nowdate = rows.item(k).Date;//.toLocaleDateString()  
	if (nowdate!=prevdate) {

	prevdate = nowdate;
	str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">'+prevdate+'</li>';
	}

	str+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#transactions" class="ui-link-inherit"><h3 class="ui-li-heading">';
	str+=rows.item(k).Bank+': '+rows.item(k).Acc_Name+'</h3><p class="ui-li-desc"><strong>';
	str+='Category: '+rows.item(k).Category+'</strong></p><p class=" ui-li-aside ui-li-desc">';
	str+='R'+Math.round(rows.item(k).Amount*100)/100+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
	}


	$('ul#transactionlist').html(str);
	
	console.log('success transact show');
}

function deletetransact() {

}