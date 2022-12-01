package com.niembro64.audience;

import android.os.Build;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {

  // EMN ADDED 2022-12-01
  // @Override
  // public void onRequestPermissionsResult(
  //   int requestCode,
  //   String permissions[],
  //   int[] grantResults
  // ) {
  //   switch (requestCode) {
  //     case 1234:
  //       {
  //         // If request is cancelled, the result arrays are empty.
  //         if (
  //           grantResults.length > 0 &&
  //           grantResults[0] == PackageManager.PERMISSION_GRANTED
  //         ) {
  //           initializePlayerAndStartRecording();
  //         } else {
  //           Log.d("TAG", "permission denied by user");
  //         }
  //         return;
  //       }
  //   }
  // }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // EMN ADDED 2022-12-01
    // if (
    //   ContextCompat.checkSelfPermission(
    //     thisActivity,
    //     Manifest.permission.RECORD_AUDIO
    //   ) !=
    //   PackageManager.PERMISSION_GRANTED
    // ) {
    //   ActivityCompat.requestPermissions(
    //     thisActivity,
    //     new String[] { Manifest.permission.RECORD_AUDIO },
    //     1234
    //   );
    // }

    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      new MainActivityDelegate(this, getMainComponentName())
    );
  }

  /**
   * Align the back button behavior with Android S
   * where moving root activities to background instead of finishing activities.
   * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
   */
  @Override
  public void invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // For non-root activities, use the default implementation to finish them.
        super.invokeDefaultOnBackPressed();
      }
      return;
    }

    // Use the default back button implementation on Android S
    // because it's doing more than {@link Activity#moveTaskToBack} in fact.
    super.invokeDefaultOnBackPressed();
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {

    public MainActivityDelegate(
      ReactActivity activity,
      String mainComponentName
    ) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
