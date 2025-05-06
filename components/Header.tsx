import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type HeaderProps = {
  userName: string;
  userLastName: string;
};

export function Header({ userName, userLastName }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: 60 + insets.top },
      ]}
    >
      <Text>
        <Text style={styles.logoSwipe}>swipe</Text>
        <Text style={styles.logoJobs}>jobs</Text>
      </Text>
      <Pressable onPress={() => router.navigate("/screens/profile")}>
        <Text style={styles.userName}>
          {userName} {userLastName}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  logoSwipe: {
    color: "#d1d5db",
    fontSize: 32,
    fontWeight: "300",
    fontFamily: "sans-serif-light",
  },
  logoJobs: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "sans-serif",
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "400",
  },
});
