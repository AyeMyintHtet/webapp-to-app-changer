export interface NativeContextPayload {
  deviceId: string | null;
  platform: "ios" | "android";
  appVersion: string | null;
  buildVersion: string | null;
  authToken?: string | null;
}

export type WebToNativeBridgeMessage =
  | { type: "OPEN_EXTERNAL_URL"; payload: { url: string } }
  | { type: "REQUEST_NATIVE_CONTEXT" }
  | { type: "LOG"; payload: { message: string; level?: "debug" | "info" | "warn" | "error" } };

export type NativeToWebBridgeMessage =
  | { type: "NATIVE_CONTEXT"; payload: NativeContextPayload }
  | { type: "AUTH_TOKEN"; payload: { token: string } };

