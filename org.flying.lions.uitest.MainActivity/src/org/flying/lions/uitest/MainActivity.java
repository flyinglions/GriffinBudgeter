package org.flying.lions.uitest;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
        
        //super.setStringProperty("loadingDialog", "Wait,Loading Demo...");
        //super.setStringProperty("loadingPageDialog", "Loading page...");
        
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/Newfolder/fastmulti.html",10000);
    }

}
