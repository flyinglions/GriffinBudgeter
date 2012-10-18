//str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">'+prevdate+'</li>';
var categorylist;

function graphSettings_toggle(theElement)
{
    $('li.'+theElement).each(function()
    {
        //alert($(this).css('display'));
        if($(this).css('display') == 'none')
        {
            $(this).css('display','block');
        }
        else
        {
            $(this).css('display','none');
        }
    });
}

function update_category(cat) {
    var newcat = $('input#'+cat+'catid').val();
    var bud = $('input#'+cat+'budget').val();

    var catref = INIgetkeyref('categories',cat);
    var budgetref = INIgetkeyref('categoriesBudgetAmounts',cat+'_Amount');
    catref.name = newcat;
    budgetref.name = newcat+'_Amount';
    budgetref.val = bud;
    db_queries.push('UPDATE SMS SET Category=\''+newcat+'\' WHERE Category=\''+cat+'\'');
    retrievesettings();
    alert("Category updated");
}
function delete_the_category(cat) {

    navigator.notification.confirm(
        'Are you sure you want to delete the category: "'+cat+'"',
        onyescat,
        'Import Inbox',
        'Cancel,Yes'
        );
    function onyescat(bindex) {
        if(bindex == 2) {
            INIdeletekey('categories',cat);
            INIdeletekey('categoriesBudgetAmounts',cat+'_Amount');

            alert('Category deleted successfully');
            retrievesettings();
        }
    }

}
function graphSettings_header(headingTitle)
{
    var tmp = '<a href="javascript:graphSettings_toggle(\'graphSettings'+headingTitle+'\');" class="ui-link-inherit">';
    tmp += '<li style="height:50px;" data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    tmp += headingTitle;
    //tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
	
    tmp += '</a>';
	
    //edit of category
    tmp+='<li style="display: none;" class="graphSettings'+headingTitle+'">';
    var budget = INIget('categoriesBudgetAmounts',headingTitle+'_Amount');
    tmp+='	<div data-role="fieldcontain"><label  for="'+headingTitle+'catid">Change category</label><input type="text" id="'+headingTitle+'catid" value="'+headingTitle+'"  />';
    tmp+='<label  for="'+headingTitle+'budget">New budget</label>	<input type="text" id="'+headingTitle+'budget" value="'+budget+'"  />';
    tmp+='<input type="button" onclick="update_category(\''+headingTitle+'\');" value="Update category"/>	';
    tmp+='<input type="button" onclick="delete_the_category(\''+headingTitle+'\');" value="Delete category"/> </div></li>';
	
    return tmp;			
}

function edit_cat_value(par,cat_val) {
    var newval = $("input#"+par+cat_val+"catid").val();
    if (newval.trim()=='') {
        alert('Field cannot be empty');
        return;
    }

    var nval = INIgetkeyref('categories',par);
    nval.val = nval.val.replace(cat_val,newval);
    alert('Updated successfully');
    retrievesettings();

}

function delete_cat_value(par,cat_val) {
    var nval = INIget('categories',par).split(',');
    var newvalue = '';
    for (var k=0; k<nval.length; k++)
        if (nval[k]!=cat_val)
            newvalue+=nval[k]+',';
    newvalue = newvalue.substring(0,newvalue.length-1);
    //nval = nval.replace(cat_val,$("input#"+par+cat_val+"catid").val());
    INIset('categories',par,newvalue);
    alert('Deleted successfully');
    retrievesettings();
}
function graphSettings_content(theCategoryValue, theParent)
{
    /*var tmp = '<li data-icon="star" style="display: none;" class="graphSettings'+theParent+'" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
    tmp += '<div class="ui-btn-inner ui-li">';
    tmp += '<div class="ui-btn-text"><img src="arrow.png" class="ui-li-icon">';
    tmp += '<a href="#" class="ui-link-inherit">';
    tmp += '<h3 style="left:20px;" class="ui-li-heading">'+theCategoryValue+'</h3>';
    //tmp += '<p class="ui-li-desc"><strong style="color: gray;">'+theAccountNum+'</strong></p>';
    tmp += '</a>';
    tmp += '</div>';
    tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';*/
	
    var tmp = '<li style="display: none;"  class="graphSettings'+theParent+'">	<div>';
    tmp+='	<input type="text" id="'+theParent+theCategoryValue+'catid" value="'+theCategoryValue+'"  />	</div>	<div  data-role="controlgroup"  data-type="horizontal">	';
    tmp+='<a href="javascript:delete_cat_value(\''+theParent+'\',\''+theCategoryValue+'\');" style="width:120px; height:50px" data-role="button" data-icon="delete"  data-theme="b" data-inline="true">Delete</a>	';
    tmp+='<a href="javascript:edit_cat_value(\''+theParent+'\',\''+theCategoryValue+'\');" style="width:120px; height:50px" data-role="button" data-icon="gear"  data-theme="b" data-inline="true">Edit</a>	</div>		</li>';
	
    return tmp;
}
function addNewCategory() {
    var newcat = $('input#settingsnewcategory').val();
    var bud = $('input#settingsbudgetcategory').val();
    INIset('categories',newcat,'');
    INIset('categoriesBudgetAmounts',newcat+'_Amount',bud);
    retrievesettings();
    alert('Category added');
}

function updateCategory() {
//not implemented
}
function add_cat_value(cat_name) {
    var newval = $('input#'+cat_name+'_addto').val();
    if (newval=='') {
        alert('Recognizer cannot be empty');
        return;
    }

    var catref = INIgetkeyref('categories',cat_name);
    if (catref.val.trim()!='')
        newval = ','+newval;
    catref.val = catref.val+newval;
    retrievesettings();
    alert('Recognizer added');
}
function retrievesettings() 
{
    $('#catul').html('<h3>Loading...</h3>');
    var transmax = INIget('settings','transmax');
    var str='';
    //$('input#transmax').val(transmax);
    //$('input#transmax').slider('refresh');
    categorylist = INIgetsection('categories');
	
    str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Graph Settings</li>';
    str+='	<li>						<div class="ui-btn-inner ui-li"><div data-role="fieldcontain"><label style="white-space:normal" for="transmax">Maximum transactions to show</label>							<input type="range" name="transmax" id="transmax" value="'+transmax+'" min="0" max="100" data-highlight="true" />								</div>												</div>					</li>	';
	
    //category header
    str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Custom categories</li>';
	
    //add of category
    str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add a category</li>';
    str+='<li data-role="fieldcontain"> <label  for="settingsnewcategory">New Category</label>   <input type="text"  id="settingsnewcategory"  name="settingsnewcategory"  value="" /></li>';
    str+='<li data-role="fieldcontain"> <label  for="settingsbudgetcategory">Budget Amount</label>   <input type="text"  id="settingsbudgetcategory"  name="settingsbudgetcategory"  value="50" /></li>';
    str+='<li class="ui-body ui-body-b"><fieldset class="ui-grid-a"><div class="ui-block-a"><button data-theme="b" onclick="addNewCategory();" >Add</button></div></fieldset></li>';
    //end add
	
    //str+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">						<div class="ui-btn-inner ui-li"><div class="ui-btn-text">';
    for (var k=0; k<categorylist.length; k++) 
    {
        var catname = categorylist[k].name;
		
        //if (catname=='undefined')
        //break;
        var val = categorylist[k].val;
        //str+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">'+'<a href="transactions.html" class="ui-link-inherit"><h3 class="ui-li-heading">'+val+'</h3><p class="ui-li-desc"><div data-role="fieldcontain">	<label style="white-space:normal" for="transmax">Maximum transactions to show</label><input type="range" name="transmax" id="transmax" value="'+transmax+'" min="0" max="100" data-highlight="true" />	</div>			</p><p class=" ui-li-aside ui-li-desc">		R333.00		</p></a>'+'</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
        var listOfValues = val.split(",");
        var values = "";
        for(var i=0; i < listOfValues.length; i++)
        {
            if (listOfValues[i].trim()=='')
                break;
            //alert(listOfValues[i]);
            values += graphSettings_content(listOfValues[i], catname);
        }
        //update category
        //var theupdatebutton  = '<li style="display: none;" class="ui-body ui-body-b"><fieldset class="ui-grid-a"><div class="ui-block-a"><button data-theme="a" onclick="updateCategory(\''+catname+'\');" >Update '+catname+'</button></div></fieldset></li>';
        str += graphSettings_header(catname) + values ;//+ theupdatebutton;
		
		
        str += '<li style="display: none;"  class="graphSettings'+catname+'">	<div>';
        str+='	<input type="text" id="'+catname+'_addto" value=""  />	</div>	<div  data-role="controlgroup"  data-type="horizontal">	';
        str+='<a href="javascript:add_cat_value(\''+catname+'\');" style="width:200px; height:50px" data-role="button" data-icon="plus"  data-theme="b" data-inline="true">Add recognizer string</a>		</div>		</li>';
	
    //str += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d" data-role="fieldcontain"><label  for="'+catname+'">'+catname+'</label><input id="'+catname+'"  value="'+val+'" type="text"></li>';
    //str += '<li  data-role="fieldcontain"><label  for="'+catname+'">'+catname+'</label><input id="'+catname+'"  value="'+val+'" type="text"></li>';
    }
	
	
	
    
    //str+='<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></div></li>'
    $('#catul').html(str);
    $('#catul').listview('refresh');
    $('#catul').trigger('create');
}

function showgraphsettings() 
{

    startINI(retrievesettings);
}
function hidegraphsettings() {
    updatefields();
    stopINI();
    doTransactionsNoResults(function () {    } );

}

function updatefields() {
    var transmax = $('input#transmax').val();
    transactionlimit = transmax;
    INIset('settings','transmax',transmax);
}
function updategraphsettings() 
{
    
    updatefields();
    /*for (var k=0; k<categorylist.length; k++)
    INIset('categories',categorylist[k].name,$('input#'+categorylist[k].name).val());*/
    stopINI();
    $.mobile.changePage($("#settings"));
    alert("Settings successfully updated");
}