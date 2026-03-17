import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface BrandedLoaderProps {
  label: string;
}

export const BrandedLoader = ({ label }: BrandedLoaderProps) => (
  <View style={styles.overlay}>
    <View style={styles.card}>
      <ActivityIndicator size="large" color="#38BDF8" />
      <Text style={styles.text}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.55)",
    justifyContent: "center",
    zIndex: 10,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#020617",
    borderColor: "#0F172A",
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 180,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  text: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
});

