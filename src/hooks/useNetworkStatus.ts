import { useCallback, useEffect, useState } from "react";
import * as Network from "expo-network";

const toOnlineState = (networkState: Network.NetworkState): boolean =>
  Boolean(networkState.isConnected && networkState.isInternetReachable !== false);

export const useNetworkStatus = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const refresh = useCallback(async () => {
    setIsChecking(true);
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(toOnlineState(networkState));
    } catch {
      // Fail open when network APIs are not reachable to avoid false offline lock.
      setIsOnline(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const subscription = Network.addNetworkStateListener((networkState) => {
      setIsOnline(toOnlineState(networkState));
      setIsChecking(false);
    });

    return () => subscription.remove();
  }, [refresh]);

  return { isOnline, isChecking, refresh };
};

