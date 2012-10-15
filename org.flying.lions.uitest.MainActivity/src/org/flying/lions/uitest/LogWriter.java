package org.flying.lions.uitest;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Calendar;

/**
 *
 * @author Orion
 */
public class LogWriter {
    private static String logFileName = "LogFile.txt";
    //private static String newLine = System.getProperty("line.separator");
    
   public static void log(String Insert) throws IOException {
        String timeStamp = "";
        Calendar cal = Calendar.getInstance();
        
        timeStamp = cal.getTime().toString();
        File sdcard = new File("");
        FileWriter fileWriter = new FileWriter("/mnt/sdcard/MEM/ORI/" + logFileName, true);
        fileWriter.append(timeStamp+":"+Insert + "\r\n");
        fileWriter.flush();
        fileWriter.close();

    }
    
}
