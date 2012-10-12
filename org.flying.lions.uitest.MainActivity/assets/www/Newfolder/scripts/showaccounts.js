var Accounts = new Array();
            var newAccounts = new Array();
            var tmpSQL ="";
            //var db;
            
            var Bank = new Array();
            var BankUp = new Array();
            var accName = new Array();
            var accNameUp = new Array();
            /*
             * 
             * ABSA cheque account: Balance R1234<br>
	        	Income: R20000<br>
	        	Expenses: R1233<br>
             */

            // Query the database
            
            function swacc_queryDB(tx) {
			//alert("hh");
                tx.executeSql('SELECT * FROM Bank_Account', [], bank_accountSuccess, errorCB);
                //tx.executeSql('SELECT * FROM sms', [], querySuccess, errorCB);
            }
            
            function header(headingTitle)
            {
                var tmp = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
                tmp += headingTitle;
                tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">2</span>';
                tmp += '</li>';
                return tmp;			
            }
            
            function content()
            {
                var tmp = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
                tmp += '<div class="ui-btn-inner ui-li">';
                tmp += '<div class="ui-btn-text">';
                tmp += '<a href="transactions.html" class="ui-link-inherit">';
                tmp += '<h3 class="ui-li-heading">ABSA: cheque account</h3>';
                tmp += '<p class="ui-li-desc"><strong>Category: Other</strong></p>';
                tmp += '<p class=" ui-li-aside ui-li-desc">R1021.00</p>';	
                tmp += '</a>';
                tmp += '</div>';
                tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
                return tmp;
            }
            
            function bank_accountSuccess(tx, results)
            {
                
                var len = results.rows.length;
                //$('<h3>List of Accounts in use</h3>').appendTo('div.data');
				var ht_str ='<h4>Overview:</h4>';
                if(len == 0)
                {
                    ht_str +='<h3>No accounts yet</h3>';
                }
                //ht_str = header('Wikus');
		
//Get Banks		
                for (var i=0; i<len; i++)
                {
                    //Accounts.push(results.rows.item(i).Account_Num);
                    console.log(results.rows.item(i).Acc_Name);
                    var tmpBank = results.rows.item(i).Bank;
                    if(BankUp.indexOf(tmpBank.toUpperCase()) < 0)
                    {
                        BankUp.push(tmpBank.toUpperCase());
                        Bank.push(tmpBank);
                        ht_str += header(tmpBank);
                        //ht_str += content();
                    }
                    //ht_str+='<hr>'+results.rows.item(i).Acc_Name+'('+results.rows.item(i).Account_Num+'): Balance '+results.rows.item(i).Balance+'<br>';//.appendTo('div.data');
                }
                
//Get Accounts
                for (i=0; i<len; i++)
                {
                    //Accounts.push(results.rows.item(i).Account_Num);
                    console.log(results.rows.item(i).Acc_Name);
                    var tmpAcc = results.rows.item(i).Acc_Name;
                    if(accNameUp.indexOf(tmpAcc.toUpperCase()) < 0)
                    {
                        accNameUp.push(tmpAcc.toUpperCase());
                        accName.push(tmpAcc);
                        alert(tmpAcc);
                        ht_str += content();
                    }
                    //ht_str+='<hr>'+results.rows.item(i).Acc_Name+'('+results.rows.item(i).Account_Num+'): Balance '+results.rows.item(i).Balance+'<br>';//.appendTo('div.data');
                }
                //$("<input class=\"button\" type=\"button\" value=\"Back\" onclick=\"redirect('../Accounts.html');\"/>").appendTo("div.data");
				
                                
                               $('ul#acc').html(ht_str);
            }

            // Transaction error callback
            //
            function errorCB(err) 
            {
                alert("Error processing SQL: "+err.code);
            }