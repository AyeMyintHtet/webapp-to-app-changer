import type { RefObject } from "react";
import type { WebView } from "react-native-webview";

import type { NativeToWebBridgeMessage, WebToNativeBridgeMessage } from "../types/bridge";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isLogLevel = (value: unknown): value is "debug" | "info" | "warn" | "error" =>
  value === "debug" || value === "info" || value === "warn" || value === "error";

export const parseBridgeMessage = (rawData: string): WebToNativeBridgeMessage | null => {
  let payload: unknown;

  try {
    payload = JSON.parse(rawData);
  } catch {
    return null;
  }

  if (!isRecord(payload) || typeof payload.type !== "string") {
    return null;
  }

  switch (payload.type) {
    case "OPEN_EXTERNAL_URL": {
      if (!isRecord(payload.payload) || typeof payload.payload.url !== "string") {
        return null;
      }

      return { type: "OPEN_EXTERNAL_URL", payload: { url: payload.payload.url } };
    }
    case "REQUEST_NATIVE_CONTEXT":
      return { type: "REQUEST_NATIVE_CONTEXT" };
    case "LOG": {
      if (!isRecord(payload.payload) || typeof payload.payload.message !== "string") {
        return null;
      }

      const level = isLogLevel(payload.payload.level) ? payload.payload.level : "info";

      return {
        type: "LOG",
        payload: {
          message: payload.payload.message,
          level,
        },
      };
    }
    default:
      return null;
  }
};

export const buildInjectMessageScript = (message: NativeToWebBridgeMessage): string => {
  const serializedMessage = JSON.stringify(message);

  return `
    (function() {
      var payload = ${serializedMessage};
      window.__NATIVE_BRIDGE__ = payload;

      if (typeof window.onNativeMessage === "function") {
        window.onNativeMessage(payload);
      }

      try {
        window.dispatchEvent(new CustomEvent("native-message", { detail: payload }));
      } catch (error) {
        var fallbackEvent = document.createEvent("CustomEvent");
        fallbackEvent.initCustomEvent("native-message", false, false, payload);
        window.dispatchEvent(fallbackEvent);
      }

      return true;
    })();
  `;
};

export const injectBridgeMessage = (
  webViewRef: RefObject<WebView | null>,
  message: NativeToWebBridgeMessage,
) => {
  webViewRef.current?.injectJavaScript(buildInjectMessageScript(message));
};
