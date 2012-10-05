var Accounts = new Array();
            var newAccounts = new Array();
            var tmpSQL ="";
            //var db;

            // Query the database
            
            function swacc_queryDB(tx) {
			//alert("hh");
                tx.executeSql('SELECT * FROM Bank_Account', [], bank_accountSuccess, errorCB);
                //tx.executeSql('SELECT * FROM sms', [], querySuccess, errorCB);
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
				
                for (var i=0; i<len; i++)
                {
                    //Accounts.push(results.rows.item(i).Account_Num);
					console.log(results.rows.item(i).Acc_Name);
                    ht_str+='<hr>'+results.rows.item(i).Acc_Name+'('+results.rows.item(i).Account_Num+'): Balance '+results.rows.item(i).Balance+'<br>';//.appendTo('div.data');
                }
                //$("<input class=\"button\" type=\"button\" value=\"Back\" onclick=\"redirect('../Accounts.html');\"/>").appendTo("div.data");
				$('div#acc').html(ht_str);
            }

            // Transaction error callback
            //
            function errorCB(err) 
            {
                alert("Error processing SQL: "+err.code);
            }