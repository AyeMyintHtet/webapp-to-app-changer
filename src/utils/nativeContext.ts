import * as Application from "expo-application";
import { Platform } from "react-native";

import type { NativeContextPayload } from "../types/bridge";

const getDeviceId = async (): Promise<string | null> => {
  if (Platform.OS === "ios") {
    return Application.getIosIdForVendorAsync();
  }

  if (Platform.OS === "android") {
    return Application.getAndroidId() ?? null;
  }

  return null;
};

export const getNativeContextPayload = async (authToken?: string): Promise<NativeContextPayload> => {
  const deviceId = await getDeviceId();

  return {
    deviceId,
    platform: Platform.OS === "ios" ? "ios" : "android",
    appVersion: Application.nativeApplicationVersion ?? null,
    buildVersion: Application.nativeBuildVersion ?? null,
    authToken: authToken ?? null,
  };
};
