var Accounts = new Array();
            var newAccounts = new Array();
            var tmpSQL ="";
            //var db;

            // Query the database
            function tmpcall() {
				//alert("call");
				
				var db_expense = db_results.shift().rows;
				var db_income = db_results.shift().rows;
				var len = db_expense.length;
				//alert(len);
				var str = '<h4>Overview:</h4>';
				for (var k=0; k<len; k++) {
				var expense = Math.round(db_expense.item(k).Am);
				var income =0;
				if (k<db_income.length)
				income = Math.round(db_income.item(k).Am);
				var bal = income+expense;
				str+='<hr>'+db_expense.item(k).Bank+' '+db_expense.item(k).Acc+': Balance '+bal+'<br />'; 
				str+='Income: '+income+'<br />';
				str+='Expenses: '+expense+'<br />';
				}
				$('div#acc').html(str);
			
			
			}
			
           /* function swacc_queryDB(tx) {
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

            */
            function errorCB(err) 
            {
                alert("Error processing SQL: "+err.code);
            }