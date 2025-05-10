import JobInfo from "@/src/components/JobInfo";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JobInformation() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <JobInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10, alignItems: "center" },
});
