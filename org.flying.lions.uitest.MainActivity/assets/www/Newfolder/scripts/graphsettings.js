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

function graphSettings_header(headingTitle)
{
    var tmp = '<a href="javascript:graphSettings_toggle(\'graphSettings'+headingTitle+'\');" class="ui-link-inherit">';
    tmp += '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">';
    tmp += headingTitle;
    //tmp += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+theTotal+'</span>';
    tmp += '</li>';
    tmp += '</a>';
    return tmp;			
}

function graphSettings_content(theCategoryValue, theParent)
{
    var tmp = '<li data-icon="star" style="display: none;" class="graphSettings'+theParent+'" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">';
    tmp += '<div class="ui-btn-inner ui-li">';
    tmp += '<div class="ui-btn-text">';
    tmp += '<a href="#" class="ui-link-inherit">';
    tmp += '<h3 class="ui-li-heading"><img src="mCategory.png" class="ui-li-icon">'+theCategoryValue+'</h3>';
    //tmp += '<p class="ui-li-desc"><strong style="color: gray;">'+theAccountNum+'</strong></p>';
    tmp += '</a>';
    tmp += '</div>';
    tmp += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
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
function retrievesettings() 
{
    var transmax = INIget('settings','transmax');
var str='';
    //$('input#transmax').val(transmax);
    //$('input#transmax').slider('refresh');
    categorylist = INIgetsection('categories');
    
 str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Graph Settings</li>';
str+='	<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">						<div class="ui-btn-inner ui-li">														<div data-role="fieldcontain">										<label style="white-space:normal" for="transmax">Maximum transactions to show</label>							<input type="range" name="transmax" id="transmax" value="'+transmax+'" min="0" max="100" data-highlight="true" />								</div>						<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span>						</div>					</li>	';
	
	//category header
     str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Custom categories</li>';
	
    //add of category
	str+='<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count">Add a category</li>';
	str+='<li data-role="fieldcontain"> <label  for="settingsnewcategory">New Category</label>   <input type="text"  id="settingsnewcategory"  name="settingsnewcategory"  value="" /></li>';
	str+='<li data-role="fieldcontain"> <label  for="settingsbudgetcategory">Budget Amount</label>   <input type="text"  id="settingsbudgetcategory"  name="settingsbudgetcategory"  value="50" /></li>';
	str+='<li class="ui-body ui-body-b"><fieldset class="ui-grid-a"><div class="ui-block-a"><button data-theme="a" onclick="addNewCategory();" >Add</button></div></fieldset></li>';
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
            //alert(listOfValues[i]);
            values += graphSettings_content(listOfValues[i], catname);
        }
		//update category
		//var theupdatebutton  = '<li style="display: none;" class="ui-body ui-body-b"><fieldset class="ui-grid-a"><div class="ui-block-a"><button data-theme="a" onclick="updateCategory(\''+catname+'\');" >Update '+catname+'</button></div></fieldset></li>';
        str += graphSettings_header(catname) + values ;//+ theupdatebutton;
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

    alert("Settings updated!");
	$.mobile.changePage($("#settings"));
}