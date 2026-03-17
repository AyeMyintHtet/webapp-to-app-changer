const getEnv = (name: string, fallback: string): string => process.env[name] ?? fallback;

const getNumberEnv = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default () => {
  const appName = getEnv("APP_NAME", "Web App Wrapper");
  const appSlug = getEnv("APP_SLUG", "webapp-to-app-changer");
  const appScheme = getEnv("APP_SCHEME", "webappwrapper");
  const appVersion = getEnv("APP_VERSION", "1.0.0");

  const iosBundleIdentifier = getEnv("IOS_BUNDLE_IDENTIFIER", "com.yourcompany.webappwrapper");
  const iosBuildNumber = getEnv("IOS_BUILD_NUMBER", "1");

  const androidPackage = getEnv("ANDROID_PACKAGE", "com.yourcompany.webappwrapper");
  const androidVersionCode = getNumberEnv("ANDROID_VERSION_CODE", 1);

  const iconPath = getEnv("APP_ICON_PATH", "./assets/icon.png");
  const splashPath = getEnv("APP_SPLASH_PATH", "./assets/splash.png");
  const adaptiveIconPath = getEnv("APP_ADAPTIVE_ICON_PATH", "./assets/adaptive-icon.png");
  const faviconPath = getEnv("APP_FAVICON_PATH", "./assets/favicon.png");

  const brandBackgroundColor = getEnv("APP_BRAND_BG_COLOR", "#0F172A");
  const uiStyle = getEnv("APP_UI_STYLE", "light");

  return {
    expo: {
      name: appName,
      slug: appSlug,
      version: appVersion,
      scheme: appScheme,
      orientation: "portrait",
      icon: iconPath,
      userInterfaceStyle: uiStyle,
      splash: {
        image: splashPath,
        resizeMode: "contain",
        backgroundColor: brandBackgroundColor,
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: iosBundleIdentifier,
        buildNumber: iosBuildNumber,
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
      },
      android: {
        package: androidPackage,
        versionCode: androidVersionCode,
        edgeToEdgeEnabled: true,
        adaptiveIcon: {
          foregroundImage: adaptiveIconPath,
          backgroundColor: brandBackgroundColor,
        },
      },
      web: {
        favicon: faviconPath,
      },
    },
  };
};

