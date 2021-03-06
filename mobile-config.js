App.info({
	id: 'com.meteorreunion.oopscat',
  name: 'oopscat',
  description: 'oopscat',
  author: 'meteorreunion',
  email: 'thomas.craipeau@gmail.com',
  version: '0.0.1'
});

App.icons({
  'android_ldpi': 'ressource/android/res/drawable-ldpi/appicon.png',
  'android_mdpi': 'ressource/android/res/drawable-mdpi/appicon.png',
  'android_hdpi': 'ressource/android/res/drawable-hdpi/appicon.png',
  'android_xhdpi': 'ressource/android/res/drawable-xhdpi/appicon.png'
});

App.launchScreens({
  // Android
  'android_ldpi_portrait': 'ressource/android/res/drawable-ldpi/default.png',
  'android_mdpi_portrait': 'ressource/android/res/drawable-mdpi/default.png',
  'android_hdpi_portrait': 'ressource/android/res/drawable-hdpi/default.png',
  'android_xhdpi_portrait': 'ressource/android/res/drawable-xhdpi/default.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#ffffff');

App.accessRule('*');

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '150211115006932',
  API_KEY: 'c94435498f5769ab15c2afb428da2bb0',
  APP_NAME:'oopscat'
});
