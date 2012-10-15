package org.flying.lions.uitest;

import java.io.*;
import java.util.Calendar;
import java.util.Scanner;

import android.os.Environment;
import android.util.Log;

public class SQLGenerator {

    //private String newLine = System.getProperty("line.separator");
    private String sqlFileName = "SQLStatements.txt";
    private String prevFileName = "prevValue.txt";
    private String timeStamp = "";
    private String[] tempReal = null;
    private int lengthCompare = 11;
    private int maxBankCount = 10;
    private String[] bankHolder = new String[maxBankCount];
    private int bankAmount = 0;
    private boolean newBank = false;
    private float prevValue = 0;
    private boolean isTrans = false;
    private boolean isFirst = false;

    public void buildSQL(String[] realValue) throws IOException {
        ////LogWriter.log("Starting SQL creation");
        timeStamp = SMSHandler.getTimeStamp();
        tempReal = realValue;
        this.getBanks();

        if (realValue.length == lengthCompare) {
            ////LogWriter.log("SQL creation for ABSA");
            newBank = !this.isInBanks(this.correctAccounts(realValue[1]));
            this.writeToFile(this.buildInsert(realValue), this.buildRecon(realValue[7], realValue[5], realValue[4]), this.buildBalanceUpdate(realValue[1]));
        } else {
            ////LogWriter.log("SQL creation for FNB");
            newBank = !this.isInBanks(this.correctAccounts(realValue[8]));
            this.writeToFile(this.buildInsert(realValue), this.buildRecon(realValue[12], realValue[2], realValue[6]), this.buildBalanceUpdate(realValue[8]));
        }
        prevValue = 0;
        isTrans = false;
    }

    private String buildInsert(String[] realValue) throws FileNotFoundException, IOException {
        String SQLStatement = "INSERT INTO sms(Date,Time,Amount,Balance,Location,Account_Num,Category) values('";
        ////LogWriter.log("SQL Insert SMS started");
        if (realValue.length == lengthCompare) {
            prevValue = Float.parseFloat(this.getCorrectBalance(realValue[7]));
            SQLStatement += this.convertFromAbsa(realValue[3]) + "','" + timeStamp + "'," + realValue[5] + "," + prevValue + ",'" + realValue[4] + "','" + realValue[1] + "','" + this.getCategories(realValue[4]) + "')";
        } else {
            prevValue = Float.parseFloat(this.getCorrectBalance(realValue[12]));
            if (realValue[8].contains("to")) {
                SQLStatement += this.handleTransfer();
                isTrans = true;
            } else {
                SQLStatement += this.getDateCorrect(realValue[15]) + "','" + timeStamp + "'," + realValue[2] + "," + prevValue + ",'" + realValue[6] + "','" + realValue[8] + "','" + this.getCategories(realValue[6]) + "')";
            }
        }
        return SQLStatement;
    }

    private String buildBalanceUpdate(String Account) {
        String returnString = "UPDATE Bank_Account SET Balance='" + prevValue + "' WHERE Account_Num='" + Account + "'";
        return returnString;
    }

    private String getCorrectBalance(String string) throws NumberFormatException, IOException {
        float currBal = Float.parseFloat(string);
        if (tempReal.length == lengthCompare) {
            if (currBal == 0) {
                currBal = this.getPrev() + Float.parseFloat(tempReal[5]);
                return currBal + "";
            }
        } else {
            if (currBal == 0) {
                currBal = this.getPrev() + Float.parseFloat(tempReal[2]);
                return currBal + "";
            }
        }
        return string;
    }

    private String buildRecon(String currBal, String diff, String Loc) throws IOException {
        String SQLStatement = "INSERT INTO Recon(Type,Recon,Account_Num,SMS_ID) values('";
        String recon = this.getRecon(currBal, diff);
        ////LogWriter.log("SQL Insert Recon started");
        if (recon.equals("0.00")) {
            return "";
        }

        String Account = "";
        String date = "";
        if (tempReal.length == lengthCompare) {
            Account = tempReal[1];
            date = this.convertFromAbsa(tempReal[3]) + ":" + timeStamp;
        } else {
            Account = tempReal[8];
            date = this.getDateCorrect(tempReal[15]) + ":" + timeStamp;
        }
        SQLStatement += this.getExspensesIncome(diff) + "'," + recon + ",'" + Account + "','" + date + "')";
        return SQLStatement;
    }


    private String getExspensesIncome(String inCurrancy) {
        if (inCurrancy.contains("-")) {
            return "Expense";
        } else {
            return "Income";
        }
    }

    private String getCategories(String Loc) throws FileNotFoundException, IOException {
        //LogWriter.log("Getting Categories");
        return SMSHandler.theSorter.getCategory(Loc);
    }

    private void getBanks() throws IOException {
    	
        try{
        //LogWriter.log("Getting the banks");
        	File sdcard = Environment.getExternalStorageDirectory();
            File folder = new File(sdcard + "/MEM/ORI");
            folder.mkdirs();

          //Get the text file
            File file = new File(sdcard + "/MEM/ORI", prevFileName);
	        Scanner sc = new Scanner(file);
	        //LogWriter.log("Got the file for banks");
	        String singleLine = "";
	        int place = 0;
	        while (sc.hasNextLine()) {
	            singleLine = sc.nextLine().trim();
	            //        System.out.println("'" + singleLine + "'");
	            bankHolder[place] = singleLine.substring(0, singleLine.indexOf("=")).trim();
	            //    System.out.println(bankHolder[place]);
	            place += 1;
        }
        // System.out.println(place);
        bankAmount = place;
        }catch(Exception e){
            System.err.println("File not found");
            isFirst = true;
            File sdcard = Environment.getExternalStorageDirectory();
            
            File folder = new File(sdcard + "/MEM/ORI");
            folder.mkdirs();

          //Get the text file
            File file = new File(sdcard + "/MEM/ORI", prevFileName);
            file.createNewFile();
            this.writePrev(0);
            
            bankAmount = 0;
        }    	
    	
   }    
    
    private String getRecon(String stringVal, String diff) throws IOException {
        try{
        //LogWriter.log("Getting the recon");
        float prevSaldo = this.getPrev();

        stringVal = stringVal.replaceAll(",", "");
        diff = diff.replaceAll(",", "");
        float currBal = Float.parseFloat(stringVal);
        float currDiff = Float.parseFloat(diff);
        float recon = 0;

        if (currBal == 0) {
            if (prevSaldo == 0) {
                prevSaldo = currBal;
                this.writePrev(prevValue);
                return "0.00";
            }
            prevSaldo = prevValue + currDiff;
            this.writePrev(prevSaldo);
            return "0.00";
        }

        if (prevSaldo == 0) {
            prevSaldo = currBal;
            this.writePrev(prevSaldo);
            return "0.00";
        }
        float newBal = 0;

        newBal = prevSaldo + currDiff;

        if (currBal == newBal) {
            prevSaldo = currBal;
            this.writePrev(prevSaldo);
            return "0.00";
        } else {
            recon = newBal - currBal;
            prevSaldo = currBal;
        }
        this.writePrev(prevSaldo);
        recon = (float) (Math.round(recon * 100.00) / 100.00);
        String reconString = String.valueOf(recon);
        //LogWriter.log("recon is " + reconString);
        return reconString;
        }catch(Exception e){e.printStackTrace();System.out.println("PETRUS! WAT DE HELL!");return "0.00";}
    }

    private void writeToFile(String Insert, String recon, String balUpdate) throws IOException {
        // System.out.println(Insert + newLine + recon);
        //LogWriter.log("Writing to file");
   	 	Log.d("SQLWriter","Writing SQLStatements");
 	
		FileWriter fileWriter = new FileWriter("/mnt/sdcard/MEM/SQLStatements.txt", true);
        fileWriter.append(Insert + "\r\n");
        if (!recon.equals("")) {
            fileWriter.append(recon + "\r\n");
        }
        // fileWriter.append(balUpdate + newLine);
        fileWriter.flush();
        fileWriter.close();

    }

    private void writePrev(float prev) throws IOException {

        try {
            //LogWriter.log("Writing prev" + prev);
            String[] lines = new String[maxBankCount];
            
            File sdcard = Environment.getExternalStorageDirectory();
            
            File folder = new File(sdcard + "/MEM/ORI");
            folder.mkdirs();

          //Get the text file
            File file = new File(sdcard + "/MEM/ORI", prevFileName); 
            Scanner sc = new Scanner(file);

            int place = 0;
            while (sc.hasNextLine()) {
                lines[place] = sc.nextLine().trim();
                // System.out.println("'" + lines[place] + "'");
                place += 1;
            }

            if (newBank && !isTrans) {
                lines[place] = this.getvalidAccount() + "=" + this.getCorrectBalance() + ";";
                //    System.out.println("-----------");
                //  System.out.println("'"+lines[place]+"'" + place + " " + bankAmount);
                bankAmount += 1;
            } else {
                for (int y = 0; y < bankAmount; y++) {
                    String compareLine = lines[y].substring(0, lines[y].indexOf("=")).trim();
                    // System.out.println( compareLine + " da banke " + bankHolder[bank]);
                    if (compareLine.toLowerCase().equals(this.getvalidAccount().toLowerCase())) {
                        lines[y] = this.getvalidAccount() + "=" + prev + ";";
                        // System.out.println(lines[y]);
                    }
                }
            }
            FileWriter fileWriter = new FileWriter("/mnt/sdcard/MEM/ORI/" + prevFileName);

            // System.out.println("-----------");
            for (int y = 0; y < bankAmount; y++) {
                fileWriter.write(lines[y] + "\r\n");
                //    System.out.println(lines[y] +"\t\t\t"+ y);
                fileWriter.flush();
            }

            fileWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
            String account = this.getvalidAccount();
            File sdcard = new File("");
            FileWriter fileWriter = new FileWriter("/mnt/sdcard/MEM/ORI/" + prevFileName);
            fileWriter.write(account + "=" + this.getCorrectBalance()+ ";");
            fileWriter.flush();
        }

    }

    private float getPrev() throws IOException {
        
        if(newBank && isFirst) {
            return Float.parseFloat(this.getCorrectBalance());
        }
        String singleLine = "";
        File sdcard = Environment.getExternalStorageDirectory();
        
        File folder = new File(sdcard + "/MEM/ORI");
        folder.mkdirs();

      //Get the text file
        File file = new File(sdcard + "/MEM/ORI", prevFileName);

        if (file.exists()) {

            Scanner sc = new Scanner(file);
            String Account = this.getvalidAccount();
            String backUpString = "";
            
            while(sc.hasNextLine()){
                singleLine = sc.nextLine();
                backUpString = singleLine.substring(0, singleLine.indexOf("=") - 1).trim();
                if(backUpString.equals(Account)) {
                    break;
                }                
            }
            
            singleLine = singleLine.substring(singleLine.indexOf("=") + 1, singleLine.indexOf(";"));
            sc.close();
            // System.out.println(singleLine);
            return Float.parseFloat(singleLine);
        } else {
    

            return 0;
        }


    }


    private String getDateCorrect(String string) {
        String day = "";
        Calendar cal = Calendar.getInstance();

        int year = cal.get(Calendar.YEAR);
        String years;
        years = year + "/";

        if (string.length() <= 10) {
            day = "/0" + string.substring(0, 1);
        } else {
            day = "/" + string.substring(0, 2);
        }

        String month = "";

        if (string.contains("Jan")) {
            month = "01";
        } else if (string.contains("Feb")) {
            month = "02";
        } else if (string.contains("Mar")) {
            month = "03";
        } else if (string.contains("Apr")) {
            month = "04";
        } else if (string.contains("May")) {
            month = "05";
        } else if (string.contains("Jun")) {
            month = "06";
        } else if (string.contains("Jul")) {
            month = "07";
        } else if (string.contains("Aug")) {
            month = "08";
        } else if (string.contains("Sep")) {
            month = "09";
        } else if (string.contains("Oct")) {
            month = "10";
        } else if (string.contains("Nov")) {
            month = "11";
        } else if (string.contains("Dec")) {
            month = "12";
        } else {
            month = "00";
        }
        return years + month + day;
    }

    private String convertFromAbsa(String string) {
        String year = "20" + string.substring(string.length() - 2, string.length()) + "/";
        String day = "/" + string.substring(0, 2);
        String month = string.substring(3, 5);
        return year + month + day;
    }

    private boolean isInBanks(String toCheck) {
        try{
        int leng = bankAmount;
        if (leng <= 0) {
            return false;
        }

        for (int y = 0; y < leng; y++) {
            if (toCheck.toLowerCase().equals(bankHolder[y].toLowerCase())) {
                return true;
            }
        }
        return false;
        }catch(Exception e){e.printStackTrace();return false;}
        
    }

    private String getvalidAccount() {
        if (tempReal.length == lengthCompare) {
            return this.correctAccounts(tempReal[1]);
        } else {
            return this.correctAccounts(tempReal[8]);
        }
    }

    private String getCorrectBalance() {
        if (tempReal.length == lengthCompare) {
            return tempReal[7];
        } else {
            return tempReal[12];
        }
    }

    private String correctAccounts(String string) {
        int cutPoint = 0;

        if (string.toLowerCase().contains("using")) {
            cutPoint = string.indexOf("using") - 1;
            string = string.substring(0, cutPoint).trim();
        }

        if (string.toLowerCase().contains("a/c")) {
            string = string.replaceAll("a/c", "Acc");
        }
        return string;
    }

    private String handleTransfer() throws FileNotFoundException, IOException {
        //cheq Acc..909429 to FNB card Acc..025000
        String returnString = "";
        int toPlace = tempReal[8].indexOf("to") - 1;
        String fromAccount = this.correctAccounts(tempReal[8].substring(0, toPlace)).trim();
        String toAccount = this.correctAccounts(tempReal[8].substring(toPlace + 7)).trim();
        //System.out.println(fromAccount + " " + toAccount);
        float tempAmountHolder = Float.parseFloat(tempReal[2]);
        returnString = this.getDateCorrect(tempReal[15]) + "','" + timeStamp + "'," + tempReal[2]/*Amount*/ + "," + (this.getPrev(fromAccount) - tempAmountHolder) + ",'" + tempReal[6] + "','" + fromAccount + "','" + this.getCategories(tempReal[6]) + "')" + "\r\n";

        this.updateAccount((this.getPrev(fromAccount) - tempAmountHolder), fromAccount);

        returnString += "INSERT INTO sms(Date,Time,Amount,Balance,Location,Account_Num,Category) values('" + this.getDateCorrect(tempReal[15]) + "','" + timeStamp + "'," + tempReal[2].replaceAll("-", "") + "," + (this.getPrev(toAccount) + tempAmountHolder) + ",'" + tempReal[6] + "','" + toAccount + "','" + this.getCategories(tempReal[6]) + "')";
        this.updateAccount((this.getPrev(fromAccount) + tempAmountHolder), toAccount);

        // System.out.println("INSERT INTO sms(Date,Time,Amount,Balance,Location,Account_Num,Category) values('" + returnString);
        // System.out.println("------------");
        return returnString;
    }

    private float getPrev(String fromAccount) throws FileNotFoundException, IOException {
        String singleLine = "";
        File sdcard = Environment.getExternalStorageDirectory();
        
        File folder = new File(sdcard + "/MEM/ORI");
        folder.mkdirs();

      //Get the text file
        File file = new File(sdcard + "/MEM/ORI", prevFileName);

        Scanner sc = new Scanner(file);
        while (sc.hasNextLine()) {
            singleLine = sc.nextLine();
            String accountString = singleLine.substring(0, singleLine.indexOf("=")).trim();
            if (fromAccount.equals(accountString)) {
                singleLine = singleLine.substring(singleLine.indexOf("=") + 1, singleLine.indexOf(";"));
                break;
            }
        }
        sc.close();
        //  System.out.println(singleLine);
        return Float.parseFloat(singleLine);

    }

    private void updateAccount(float f, String fromAccount) throws IOException {

        String[] lines = new String[maxBankCount];
        File sdcard = Environment.getExternalStorageDirectory();
        
        File folder = new File(sdcard + "/MEM/ORI");
        folder.mkdirs();

        File file = new File(sdcard + "/MEM/ORI", prevFileName);
        Scanner sc = new Scanner(file);

        int place = 0;
        while (sc.hasNextLine()) {
            lines[place] = sc.nextLine().trim();
            place += 1;
        }


        for (int y = 0; y < bankAmount; y++) {
            String compareLine = lines[y].substring(0, lines[y].indexOf("=")).trim();
            if (compareLine.toLowerCase().equals(fromAccount.toLowerCase())) {
                lines[y] = fromAccount + "=" + f + ";";
            }
        }

        FileWriter fileWriter = new FileWriter("/mnt/sdcard/MEM/ORI/" + prevFileName);
        for (int y = 0; y < bankAmount; y++) {
            fileWriter.write(lines[y] + "\r\n");
            fileWriter.flush();
        }
        fileWriter.close();
    }
}