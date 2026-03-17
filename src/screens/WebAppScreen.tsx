import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigationEvent,
  WebViewProgressEvent,
  ShouldStartLoadRequest,
  WebViewMessageEvent,
} from "react-native-webview/lib/WebViewTypes";

import { BrandedLoader } from "../components/BrandedLoader";
import { OfflineState } from "../components/OfflineState";
import { BRAND_NAME, getAppHost, NATIVE_AUTH_TOKEN, WEB_APP_URL, WEBVIEW_CACHE_ENABLED } from "../config/env";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useWebViewBackHandler } from "../hooks/useWebViewBackHandler";
import type { NativeContextPayload } from "../types/bridge";
import { shouldOpenInExternalBrowser } from "../utils/navigation";
import { getNativeContextPayload } from "../utils/nativeContext";
import { injectBridgeMessage, parseBridgeMessage } from "../utils/webviewBridge";

export const WebAppScreen = () => {
  const { isOnline, isChecking, refresh } = useNetworkStatus();
  const { webViewRef, onNavigationStateChange } = useWebViewBackHandler();

  const [nativeContext, setNativeContext] = useState<NativeContextPayload | null>(null);
  const [showNavigationLoader, setShowNavigationLoader] = useState(false);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  const loaderVisibleRef = useRef(false);
  const loaderStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appHost = useMemo(() => getAppHost(), []);
  const webViewSource = useMemo(() => ({ uri: WEB_APP_URL }), []);

  const clearLoaderStartTimer = useCallback(() => {
    if (loaderStartTimerRef.current) {
      clearTimeout(loaderStartTimerRef.current);
      loaderStartTimerRef.current = null;
    }
  }, []);

  const hideNavigationLoader = useCallback(() => {
    clearLoaderStartTimer();
    if (loaderVisibleRef.current) {
      setShowNavigationLoader(false);
    }
  }, [clearLoaderStartTimer]);

  const scheduleNavigationLoader = useCallback(() => {
    if (!firstLoadComplete) {
      return;
    }

    clearLoaderStartTimer();
    loaderStartTimerRef.current = setTimeout(() => {
      setShowNavigationLoader(true);
    }, 180);
  }, [clearLoaderStartTimer, firstLoadComplete]);

  useEffect(() => {
    loaderVisibleRef.current = showNavigationLoader;
  }, [showNavigationLoader]);

  useEffect(() => {
    if (!showNavigationLoader) {
      return;
    }

    // Failsafe to prevent sticky overlays when some load events are skipped by the engine.
    const timeoutId = setTimeout(() => {
      hideNavigationLoader();
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [hideNavigationLoader, showNavigationLoader]);

  useEffect(
    () => () => {
      clearLoaderStartTimer();
    },
    [clearLoaderStartTimer],
  );

  useEffect(() => {
    let alive = true;

    const prepareNativeContext = async () => {
      const context = await getNativeContextPayload(NATIVE_AUTH_TOKEN || undefined);
      if (alive) {
        setNativeContext(context);
      }
    };

    void prepareNativeContext();

    return () => {
      alive = false;
    };
  }, []);

  const injectNativeContext = useCallback(() => {
    if (!webViewRef.current || !nativeContext) {
      return;
    }

    injectBridgeMessage(webViewRef, { type: "NATIVE_CONTEXT", payload: nativeContext });

    if (nativeContext.authToken) {
      injectBridgeMessage(webViewRef, {
        type: "AUTH_TOKEN",
        payload: { token: nativeContext.authToken },
      });
    }
  }, [nativeContext, webViewRef]);

  const handleWebMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseBridgeMessage(event.nativeEvent.data);

      if (!message) {
        console.warn("[Bridge] Ignored malformed payload:", event.nativeEvent.data);
        return;
      }

      switch (message.type) {
        case "OPEN_EXTERNAL_URL":
          void Linking.openURL(message.payload.url);
          break;
        case "REQUEST_NATIVE_CONTEXT":
          injectNativeContext();
          break;
        case "LOG": {
          const output = `[WebView:${message.payload.level ?? "info"}] ${message.payload.message}`;
          if (message.payload.level === "error") {
            console.error(output);
          } else if (message.payload.level === "warn") {
            console.warn(output);
          } else {
            console.log(output);
          }
          break;
        }
      }
    },
    [injectNativeContext],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest) => {
      if (!request.url || request.url.startsWith("about:blank")) {
        return true;
      }

      if (shouldOpenInExternalBrowser(request.url, appHost)) {
        hideNavigationLoader();
        void Linking.openURL(request.url);
        return false;
      }

      return true;
    },
    [appHost, hideNavigationLoader],
  );

  const handleLoadStart = useCallback((event: WebViewNavigationEvent) => {
    if (shouldOpenInExternalBrowser(event.nativeEvent.url, appHost)) {
      hideNavigationLoader();
      return;
    }

    scheduleNavigationLoader();
  }, [appHost, hideNavigationLoader, scheduleNavigationLoader]);

  const handleLoadProgress = useCallback((event: WebViewProgressEvent) => {
    if (event.nativeEvent.progress >= 0.97) {
      hideNavigationLoader();
    }
  }, [hideNavigationLoader]);

  const handleLoadEnd = useCallback(() => {
    if (!firstLoadComplete) {
      setFirstLoadComplete(true);
    }
    hideNavigationLoader();
    injectNativeContext();
  }, [firstLoadComplete, hideNavigationLoader, injectNativeContext]);

  const handleLoadError = useCallback((event: WebViewErrorEvent) => {
    console.warn("[WebView] Load error:", event.nativeEvent.description);
    hideNavigationLoader();
  }, [hideNavigationLoader]);

  const handleHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    console.warn("[WebView] HTTP error:", event.nativeEvent.statusCode, event.nativeEvent.url);
    hideNavigationLoader();
  }, [hideNavigationLoader]);

  if (!isOnline) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <OfflineState checking={isChecking} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={webViewSource}
          onMessage={handleWebMessage}
          onNavigationStateChange={onNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onError={handleLoadError}
          onHttpError={handleHttpError}
          startInLoadingState
          renderLoading={() => <BrandedLoader label={`${BRAND_NAME}`} />}
          cacheEnabled={WEBVIEW_CACHE_ENABLED}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          decelerationRate={Platform.OS === "ios" ? "fast" : undefined}
          androidLayerType="hardware"
          cacheMode={Platform.OS === "android" ? (WEBVIEW_CACHE_ENABLED ? "LOAD_DEFAULT" : "LOAD_NO_CACHE") : undefined}
          overScrollMode={Platform.OS === "android" ? "never" : undefined}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          allowsLinkPreview={false}
          bounces={false}
          allowsBackForwardNavigationGestures
          mediaPlaybackRequiresUserAction={false}
        />

        {showNavigationLoader ? <BrandedLoader label={`Loading ${BRAND_NAME}`} /> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#020617",
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
  },
});
