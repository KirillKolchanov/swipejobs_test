import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User information:</Text>
      <Text style={styles.info}>Name: John</Text>
      <Text style={styles.info}>Surname: Doe</Text>
      <Text style={styles.info}>Email: john.doe@email.com</Text>
      <Pressable style={styles.goBack} onPress={() => router.back()}>
        <Text style={styles.goBackText}>← Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
  },
  info: {
    fontSize: 25,
    marginBottom: 12,
  },
  goBack: {
    position: "absolute",
    top: 15,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  goBackText: {
    color: "#007AFF",
    fontSize: 20,
    fontWeight: "500",
  },
});
