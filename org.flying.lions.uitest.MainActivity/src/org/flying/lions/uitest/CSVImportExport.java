package org.flying.lions.uitest;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONException;

import java.lang.System;
import android.os.Environment;
import android.util.Log;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

public class CSVImportExport extends Plugin {
	
	public static final String TAG = "CSVImport_Export_Plugin";
	
	/** Currently active plugin instance */
	public static Plugin currentPluginInstance;



    @Override
    public PluginResult execute(String action, JSONArray data, String callbackId) {
        Log.d(TAG, "Plugin Called");
        PluginResult result = null;
        //JSONObject transactions = new JSONObject();
        currentPluginInstance = this;
        
        
        if (action.equals("importCSV")) {
            try {
            	String fileLocation = data.getString(0);
            	          	
            	importCSV(fileLocation);
            	
                result = new PluginResult(PluginResult.Status.OK);
            } catch (JSONException jsonEx) {
                Log.d(TAG, "Got JSON Exception "+ jsonEx.getMessage());
                result = new PluginResult(PluginResult.Status.JSON_EXCEPTION);
            }
            catch (IOException ioEx) {
                Log.d(TAG, "Got IO Exception "+ ioEx.getMessage());
                result = new PluginResult(PluginResult.Status.IO_EXCEPTION);
            }
        }
        else if(action.equals("exportCSV")) {
            try{
            	String fileLocation = data.getString(0);
            	String transactions = data.getString(1);
            	
            	
            	exportCSV(fileLocation, transactions);
            	
            	result = new PluginResult(PluginResult.Status.OK);
            	
            } 
            catch (JSONException jsonEx) {
                Log.d(TAG, "Got JSON Exception "+ jsonEx.getMessage());
                result = new PluginResult(PluginResult.Status.JSON_EXCEPTION);
            }
            catch (IOException ioEx) {
                Log.d(TAG, "Got IO Exception "+ ioEx.getMessage());
                result = new PluginResult(PluginResult.Status.IO_EXCEPTION);
            }
        }
        else {
            result = new PluginResult(PluginResult.Status.INVALID_ACTION);
            Log.d(TAG, "Invalid action : "+action+" passed");
        }
        return result;
    }
    
    private void importCSV(String fileLoc) throws IOException
    {
    	String tempString;
    	
    	File sdcard = Environment.getExternalStorageDirectory();
    	
       	File file = new File(sdcard + "/test.csv");   
        
       	if(file.exists())
        {
            Scanner lineScanner = new Scanner(file);
            int smsCount = 0;
            while (lineScanner.hasNextLine()) {
                    lineScanner.nextLine();
                    smsCount++;
            }
            lineScanner.close();
            
            Log.d(TAG, "LINECOUNT" + Integer.toString(smsCount));
            
            int incVal = 0;
            int counter = 0;
            
            Scanner sc = new Scanner(file);
            
            while (sc.hasNextLine()) {
            	tempString = sc.nextLine();
                int comIndex = 0;
                
                counter+=1;

                for (int y = 0; y < 7; y++) {
                    comIndex = tempString.indexOf(",");
                    tempString = tempString.substring(comIndex + 1, tempString.length());
                }
                try 
                {
                    tempString = tempString.substring(1, tempString.length() - 1);
                } 
                catch (Exception e) 
                {
                	Log.e(TAG, "CSV file syntax error");
                }
                
                try
    			{
                	Long tsLong = System.currentTimeMillis();
    				String timestamp = tsLong.toString();
    				
    				MultipleSmsHandler smsHand = new MultipleSmsHandler();
    		        smsHand.parseSMS(tempString+ ";" + timestamp);
    		        
    		        
    		        incVal = counter * 100 / smsCount;
    		        
    		        currentPluginInstance.sendJavascript("javascript:upProgress("+ Integer.toString(incVal) +")");
    			}
    			catch(Exception ex)
    			{
    				ex.printStackTrace();
    			}
                
            }

            sc.close();

        }
       	else
       	{
       		currentPluginInstance.sendJavascript("javascript:alert(\"test.csv not found on sdcard\")");
       		Log.d(TAG, "test.csv not in root");
       	}
       	
       	
    
    
    }
    
    private void exportCSV(String fileLocation, String transactions) throws IOException
    {
    	String tempString = "EXPORT";

		FileWriter fileWriter = new FileWriter("/mnt/sdcard/export.csv");
		 
			 
		fileWriter.write(tempString);
		fileWriter.write(transactions);
		
		fileWriter.flush();
		fileWriter.close();
		
		currentPluginInstance.sendJavascript("javascript:alert(\"EXPORT\")");
    	
    }
    
}