import { API_BASE_URL, USER_ID } from "@/src/constants";
import { useUser } from "@/src/hooks/useUser";
import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

export function Profile() {
  const { user, loading, error } = useUser(API_BASE_URL, USER_ID);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || "User not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal information</Text>
          <Text style={styles.text}>Name: {user.firstName}</Text>
          <Text style={styles.text}>Surname: {user.lastName}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.phoneNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.text}>{user.address.formattedAddress}</Text>
          <Text style={styles.text}>Time zone: {user.address.zoneId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.text}>
            Maximum distance to work: {user.maxJobDistance} km
          </Text>
        </View>
      </ScrollView>
      <Pressable style={styles.goBack} onPress={() => router.back()}>
        <Text style={styles.goBackText}>← Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    flex: 1,
    margin: "auto",
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
    color: "red",
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
