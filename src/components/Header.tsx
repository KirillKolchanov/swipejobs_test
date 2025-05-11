import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname, Link } from "expo-router";
import { API_BASE_URL, USER_ID } from "@/src/constants";
import { useUser } from "@/src/hooks/useUser";

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error } = useUser(API_BASE_URL, USER_ID);
  const { width: screenWidth } = useWindowDimensions();

  let contentWidth;
  if (screenWidth <= 420) {
    contentWidth = screenWidth * 0.98;
  } else if (screenWidth <= 700) {
    contentWidth = 440;
  } else {
    contentWidth = 600;
  }

  const handleLogoPress = () => {
    if (pathname === "/") {
      return;
    } else {
      router.replace("/");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: 60 + insets.top },
      ]}
    >
      <View style={[styles.content, { width: contentWidth, minWidth: 375 }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
