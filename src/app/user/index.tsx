import { Profile } from "@/src/components/Profile";
import { View, StyleSheet } from "react-native";

export default function User() {
  return (
    <View style={styles.container}>
      <Profile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
