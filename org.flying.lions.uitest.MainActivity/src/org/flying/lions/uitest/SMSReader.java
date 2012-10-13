package org.flying.lions.uitest;

import android.app.ProgressDialog;
import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Looper;
import android.util.Log;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class SMSReader extends Plugin {
	
	public static final String TAG = "SMSReadPlugin";
	
	/** Currently active plugin instance */
	public static Plugin currentPluginInstance;



    @Override
    public PluginResult execute(String action, JSONArray data, String callbackId) {
        Log.d(TAG, "Plugin Called");
        PluginResult result = null;
        JSONObject messages = new JSONObject();
        if (action.equals("inbox")) {
            try {
            	currentPluginInstance = this;
                messages = readSMS("inbox");
                
                Log.d(TAG, "Returning " + messages.toString());
                result = new PluginResult(PluginResult.Status.OK, messages);
            } catch (JSONException jsonEx) {
                Log.d(TAG, "Got JSON Exception "+ jsonEx.getMessage());
                result = new PluginResult(PluginResult.Status.JSON_EXCEPTION);
            }
        }
        else {
            result = new PluginResult(PluginResult.Status.INVALID_ACTION);
            Log.d(TAG, "Invalid action : "+action+" passed");
        }
        return result;
    }


    //Read messages from inbox/or sent box.
    private JSONObject readSMS(String folder) throws JSONException {
    	
    	//currentPluginInstance.sendJavascript("javascript:alert(\"" + android.os.Build.DEVICE + "\")");
    	//currentPluginInstance.sendJavascript("javascript:alert(\"" + android.os.Build.MANUFACTURER + "\")");

    	
    	
    	
        
    	/*	@param data 
    			JSON object sent to javascript
    		@param smsList
    			JSON array that is in data
    			
    			makes it easier to read data in javascript => data.messages[0].id
    		
    		*/
    	
    	JSONObject data = new JSONObject();
        Uri uriSMSURI = Uri.parse("");
        if(folder.equals("inbox")){
            uriSMSURI = Uri.parse("content://sms/inbox");
        }

        Cursor cur = getContentResolver().query(uriSMSURI, null, null, null,null);
        JSONArray smsList = new JSONArray();
        data.put("messages", smsList);
        
        
        /*ProgressDialog progressDialog = new ProgressDialog(super.ctx.getActivity());
        
        progressDialog.setMessage("Importing...");
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setProgress(0); // set percentage completed to 0%
        //progressDialog.show();*/

        int smsCount = cur.getCount();
        //Log.d(TAG, Integer.toString(smsCount));
        int incVal = 0;
        int counter = 0;
        
        while (cur.moveToNext())
        {
        	counter+=1;
        	
  	
        	
			try
			{
				MultipleSmsHandler smsHand = new MultipleSmsHandler();
		        smsHand.parseSMS(cur.getString(cur.getColumnIndex("body")) + ";" + cur.getString(cur.getColumnIndex("date")));
		        Log.d(TAG, "SUCCESS");
			}
			catch(Exception ex)
			{
				ex.printStackTrace();
			}
        	
        	//SOLVED: Works for both devices Samsung and HTC
        	JSONObject sms = new JSONObject();
            sms.put("number",cur.getString(cur.getColumnIndex("address")));
            sms.put("text",cur.getString(cur.getColumnIndex("body")));
            sms.put("id",cur.getString(cur.getColumnIndex("date")));
            

       
            incVal = counter * 100 / smsCount;
            //progressDialog.incrementProgressBy(incVal);
            
			if (currentPluginInstance != null)
			{
		 	   	currentPluginInstance.sendJavascript("javascript:upProgress("+ Integer.toString(incVal) +")");
			}
            
            smsList.put(sms);
        }
        
        //progressDialog.dismiss();
        
        
        /*
         * Using the JSON object data sent to decoder //Use without the Log.d obviously
         * 
         * Log.d(TAG, Integer.toString(data.getJSONArray("messages").length()));
         * 		How many smses is in object
         * 
         * Log.d(TAG, data.getJSONArray("messages").getJSONObject(0).get("body").toString());
         * 		String value of "body" value of the first SMS - index 0 
        */
        
        
        return data;
    }

   
    private ContentResolver getContentResolver(){
       return this.ctx.getActivity().getContentResolver();
    }



}