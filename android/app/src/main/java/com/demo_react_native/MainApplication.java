package com.demo_react_native;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.pgsqlite.SQLitePluginPackage;

import com.toast.RCTToastPackage;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            CallbackManager mCallbackManager = new CallbackManager.Factory().create();

            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNFirebasePackage(),
                    new RNGoogleSigninPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNAdMobPackage(),
                    new SQLitePluginPackage(),
                    new MapsPackage(),
                    new RCTToastPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        FacebookSdk.sdkInitialize(getApplicationContext());
    }
}
