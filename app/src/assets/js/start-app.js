module.exports = {
  packageLaunch: function (appSchemeStr) {
    // launch app using package name (for Android devices)
    window.plugins.launcher.launch({
        packageName: appSchemeStr
      },
      function () {},
      function () {
        window.location.href = "https://play.google.com/store/apps/details?id=com.app.vivobee";
      }
    );
  },
  uriLaunch: function (appUriStr) {
    // launch app using URI (for iOS devices)
    window.plugins.launcher.launch({
        uri: appUriStr
      },
      function () {},
      function () {
        alert('Failed to open app')
      }
    );
  },
}
