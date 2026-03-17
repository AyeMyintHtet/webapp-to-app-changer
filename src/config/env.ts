const DEFAULT_WEB_APP_URL = "https://your-nextjs-domain.com";
const DEFAULT_BRAND_NAME = "Your Brand";

export const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL ?? DEFAULT_WEB_APP_URL;
export const BRAND_NAME = process.env.EXPO_PUBLIC_BRAND_NAME ?? DEFAULT_BRAND_NAME;

export const WEBVIEW_CACHE_ENABLED =
  (process.env.EXPO_PUBLIC_WEBVIEW_CACHE_ENABLED ?? "true").toLowerCase() === "true";

export const NATIVE_AUTH_TOKEN = process.env.EXPO_PUBLIC_NATIVE_AUTH_TOKEN ?? "";

export const getAppHost = (): string | null => {
  try {
    return new URL(WEB_APP_URL).hostname.toLowerCase();
  } catch {
    return null;
  }
};

