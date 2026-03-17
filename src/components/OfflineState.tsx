import { Pressable, StyleSheet, Text, View } from "react-native";

interface OfflineStateProps {
  checking: boolean;
  onRetry: () => void;
}

export const OfflineState = ({ checking, onRetry }: OfflineStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>No Internet Connection</Text>
    <Text style={styles.subtitle}>
      Check your connection and try again to continue using the app.
    </Text>
    <Pressable
      disabled={checking}
      onPress={onRetry}
      style={({ pressed }) => [
        styles.button,
        pressed && !checking ? styles.buttonPressed : null,
        checking ? styles.buttonDisabled : null,
      ]}
    >
      <Text style={styles.buttonText}>{checking ? "Checking..." : "Retry"}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#020617",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0284C7",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    backgroundColor: "#334155",
  },
  buttonText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
});

