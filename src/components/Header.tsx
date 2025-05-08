import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname, Link } from "expo-router";
import { API_BASE_URL, USER_ID } from "@/src/constants";
import { useUser } from "@/src/hooks/useUser";

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error } = useUser(API_BASE_URL, USER_ID);

  const handleLogoPress = () => {
    if (pathname === "/") {
      return;
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: 60 + insets.top },
      ]}
    >
      <Pressable onPress={handleLogoPress}>
        <Text>
          <Text style={styles.logoSwipe}>swipe</Text>
          <Text style={styles.logoJobs}>jobs</Text>
        </Text>
      </Pressable>

      {loading ? (
        <Text style={styles.userName}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>User not found</Text>
      ) : (
        <Link href={"/user"}>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
        </Link>
      )}
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
  errorText: {
    fontSize: 24,
    fontWeight: "400",
    color: "red",
  },
});
